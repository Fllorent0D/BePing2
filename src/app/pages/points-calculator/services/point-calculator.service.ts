import {Injectable} from '@angular/core';
import {PointsCalculatorEntry} from '../../../core/store/points/points-calculator-state.service';
import {
    boundingPointsMen,
    boundingPointsWomen,
    coefficientPerEventMen,
    coefficientPerEventWomen,
    EVENT_TYPE,
    EventCoefficient,
    MATCH_RESULT,
    PointsBounding
} from '../../../core/models/points';
import {PLAYER_CATEGORY} from '../../../core/models/user';

@Injectable({
    providedIn: 'root'
})
export class PointCalculatorService {

    constructor() {
    }

    calculatePoints(result: PointsCalculatorEntry, basePoint: number, category: PLAYER_CATEGORY): number {
        const diff = Math.round(Math.max(basePoint, result.opponentRanking) - Math.min(basePoint, result.opponentRanking));
        const isExpected = (result.opponentRanking > basePoint && result.victory === MATCH_RESULT.DEFEAT)
            || (result.opponentRanking < basePoint && result.victory === MATCH_RESULT.VICTORY);
        const pointsLimits: PointsBounding = this.findBoundingPointsForPointDiff(diff, category);
        console.log('pointslimits', pointsLimits, isExpected, result, category, basePoint, diff);
        const points: number = isExpected ? pointsLimits.expectedResult : pointsLimits.unexpectedResult;
        const {coefficient}: EventCoefficient = this.findCoefficientEvent(result.eventType, result.eventId, category);

        return points * coefficient * (result.victory === MATCH_RESULT.VICTORY ? 1 : -0.8);
    }

    findBoundingPointsForPointDiff(pointDiff: number, category: PLAYER_CATEGORY): PointsBounding {
        return this.getBoundingPointsTableForCategory(category).find((boundingPoint: PointsBounding) =>
            boundingPoint.lowerBound <= pointDiff && boundingPoint.upperBound >= pointDiff
        );
    }

    getBoundingPointsTableForCategory(category: PLAYER_CATEGORY) {
        switch (category) {
            case PLAYER_CATEGORY.WOMEN:
            case PLAYER_CATEGORY.VETERANS_WOMEN:
                return boundingPointsWomen;
            case PLAYER_CATEGORY.YOUTH:
            case PLAYER_CATEGORY.VETERANS:
            case PLAYER_CATEGORY.MEN:
                return boundingPointsMen;
        }
    }

    getCoefficentEventForCategory(category: PLAYER_CATEGORY): { [key: string]: EventCoefficient[] } {
        switch (category) {
            case PLAYER_CATEGORY.WOMEN:
            case PLAYER_CATEGORY.VETERANS_WOMEN:
                return coefficientPerEventWomen;
            case PLAYER_CATEGORY.YOUTH:
            case PLAYER_CATEGORY.VETERANS:
            case PLAYER_CATEGORY.MEN:
                return coefficientPerEventMen;
        }
    }

    findCoefficientEvent(eventType: EVENT_TYPE, eventId: string, category: PLAYER_CATEGORY): EventCoefficient {
        return this.getCoefficentEventForCategory(category)[eventType].find((event) => event.eventId === eventId);
    }

}
