import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {WeeklyNumericRankingV3} from '../../../api/models/weekly-numeric-ranking-v-3';
import {UpdateMemberEntries, UpdateMemberEntriesSuccess} from '../user.actions';
import {catchError, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserMemberEntries, UserState, UserStateModel} from '../user.state';
import {PlayerCategoryService} from '../../../services/tabt/player-category.service';
import {PLAYER_CATEGORY} from '../../../models/user';
import {sub} from 'date-fns';
import {UpdateNumericRanking, UpdateNumericRankingSuccess} from './numeric-ranking.action';

export interface NumericRankingStateModel {
    lastUpdate: number;
    category: {
        [key: string]: WeeklyNumericRankingV3;
    };
    faultyWebsite: boolean;
}

export const numericRankingStateDefaults: NumericRankingStateModel = {
    lastUpdate: 0,
    category: {},
    faultyWebsite: false,
};

@State<NumericRankingStateModel>({
    name: 'numericRanking',
    defaults: numericRankingStateDefaults
})
@Injectable()
export class NumericRankingState implements NgxsOnInit {
    constructor(
        private readonly memberPlayerCategoryService: PlayerCategoryService,
        private readonly store: Store
    ) {
    }

    ngxsOnInit(ctx: StateContext<any>): void {
        // Used only when migrating from old version
        const userState: UserStateModel = this.store.selectSnapshot(UserState);
        const state: NumericRankingStateModel = ctx.getState();
        const timeThreshold = sub(Date.now(), {days: 1});


        // App initialize and need to refresh
        if (state.lastUpdate < timeThreshold.getTime() && userState.memberUniqueIndex) {
            ctx.dispatch(new UpdateNumericRanking(false));
        }
    }

    static getNumericRankingyForCategory(category: PLAYER_CATEGORY) {
        return createSelector([NumericRankingState], (numericRankingState: NumericRankingStateModel) => {
            return numericRankingState.category[category];
        });
    }

    static getLatestPointsForCategory(category: PLAYER_CATEGORY) {
        return createSelector([NumericRankingState], (numericRankingState: NumericRankingStateModel) => {
            return numericRankingState.category[category]?.actualPoints;
        });
    }

    @Action([UpdateMemberEntriesSuccess, UpdateNumericRanking])
    updateNumericRankings({
                              patchState,
                              getState,
                              dispatch
                          }: StateContext<NumericRankingStateModel>, {forceUpdate}: UpdateMemberEntries | UpdateNumericRanking) {
        const timeThreshold = sub(Date.now(), {days: 1});
        const state: NumericRankingStateModel = getState();
        // threshold to avoid spamming the API
        if (state.lastUpdate > timeThreshold.getTime() && !forceUpdate) {
            return of([]);
        }

        const membersEntries: UserMemberEntries = this.store.selectSnapshot(UserState.getMemberEntries);
        if (membersEntries) {
            return this.memberPlayerCategoryService.getMemberNumericRankings(membersEntries).pipe(
                switchMap((rankingsPerCategory) =>
                    dispatch(new UpdateNumericRankingSuccess(rankingsPerCategory, new Date(), forceUpdate))
                ),
                catchError(() => of(null))
            );
        }
        return of([]);
    }

    @Action([UpdateNumericRankingSuccess])
    updateNumericRankingSuccess({patchState, getState}: StateContext<NumericRankingStateModel>, {
        lastUpdate,
        points: fetchedPoints,
        forceUpdate
    }: UpdateNumericRankingSuccess): void {
        const state: NumericRankingStateModel = getState();
        const rankings: [string, WeeklyNumericRankingV3][] = Object.entries(fetchedPoints);
        for (const [category, points] of rankings) {
            const currentState = state.category[category];
            patchState({
                category: fetchedPoints,
                lastUpdate: lastUpdate.getTime(),
                faultyWebsite: false,
            });

        }
    }
}
