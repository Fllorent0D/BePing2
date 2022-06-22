import {Injectable} from '@angular/core';
import {createSelector, State} from '@ngxs/store';
import {defaultEntityState, EntityState, EntityStateModel, IdStrategy} from '@ngxs-labs/entity-state';
import {EVENT_TYPE, MATCH_RESULT} from '../../models/points';
import {PLAYER_CATEGORY} from '../../models/user';

export interface PointsCalculatorEntry {
    category: PLAYER_CATEGORY;
    opponentName: string;
    opponentRanking: number;
    victory: MATCH_RESULT;
    eventType: EVENT_TYPE;
    eventId: string;
    id?: string;
}

export interface PointsCalculatorEntryWithPoints extends PointsCalculatorEntry {
    pointsWon: number;
    basePoints: number;
}

@State<EntityStateModel<PointsCalculatorEntry>>({
    name: 'pointsCalculator',
    defaults: defaultEntityState()
})
@Injectable()
export class PointsCalculatorState extends EntityState<PointsCalculatorEntry> {
    constructor() {
        super(PointsCalculatorState, 'id', IdStrategy.UUIDGenerator);
    }

    static pointsForPlayerCategory(category: PLAYER_CATEGORY) {
        return createSelector([PointsCalculatorState.entities], (allPoints: PointsCalculatorEntry[]) => {
            return allPoints.filter((e) => e.category === category);
        });
    }


}
