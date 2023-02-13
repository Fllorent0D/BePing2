import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {WeeklyNumericRankingV3} from '../../../api/models/weekly-numeric-ranking-v-3';
import {UpdateMemberEntries, UpdateMemberEntriesSuccess} from '../user.actions';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserMemberEntries, UserState, UserStateModel} from '../user.state';
import {PlayerCategoryService} from '../../../services/tabt/player-category.service';
import {PLAYER_CATEGORY} from '../../../models/user';

export interface NumericRankingStateModel {
    [key: string]: WeeklyNumericRankingV3;
}

@State<NumericRankingStateModel>({
    name: 'numericRanking',
    defaults: {}
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
        const state  = ctx.getState();

        if(Object.keys(userState.memberEntries).length && Object.keys(state).length === 0) {
            ctx.dispatch(new UpdateMemberEntries(userState.memberUniqueIndex, false));
        }
    }

    static getNumericRankingyForCategory(category: PLAYER_CATEGORY) {
        return createSelector([NumericRankingState], (numericRankingState: NumericRankingStateModel) => {
            return numericRankingState[category];
        });
    }

    static getLatestPointsForCategory(category: PLAYER_CATEGORY) {
        return createSelector([NumericRankingState], (numericRankingState: NumericRankingStateModel) => {
            return numericRankingState[category]?.points[numericRankingState[category]?.points.length - 1].points;
        });
    }

    @Action([UpdateMemberEntries, UpdateMemberEntriesSuccess])
    updateNumericRankingsInfo({patchState, getState}: StateContext<UserStateModel>) {
        const membersEntries: UserMemberEntries = this.store.selectSnapshot(UserState.getMemberEntries);
        if (membersEntries) {
            return this.memberPlayerCategoryService.getMemberNumericRankings(membersEntries).pipe(
                map((rankingsPerCategory) => {
                    return patchState(rankingsPerCategory);
                }),
                catchError(() => of(null))
            );
        }
        return of();

    }
}
