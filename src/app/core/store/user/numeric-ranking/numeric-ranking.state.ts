import {Injectable} from '@angular/core';
import {Action, createSelector, State, StateContext} from '@ngxs/store';
import {WeeklyNumericRankingV3} from '../../../api/models/weekly-numeric-ranking-v-3';
import {UpdateMemberEntriesSuccess} from '../user.actions';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {UserStateModel} from '../user.state';
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
export class NumericRankingState {
    constructor(
        private readonly memberPlayerCategoryService: PlayerCategoryService,
    ) {
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

    @Action([UpdateMemberEntriesSuccess])
    updateNumericRankingsInfo({patchState, getState}: StateContext<UserStateModel>, action: UpdateMemberEntriesSuccess) {

        return this.memberPlayerCategoryService.getMemberNumericRankings(action.memberEntries).pipe(
            map((rankingsPerCategory) => {
                return patchState(rankingsPerCategory);
            }),
            catchError(() => of(null))
        );
    }
}
