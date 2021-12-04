import {Injectable} from '@angular/core';
import {PointsCalculatorEntry} from '../../../core/store/points/points-calculator-state.service';
import {boundingPoints, coefficientPerEvent, EVENT_TYPE, EventCoefficient, MATCH_RESULT, PointsBounding} from '../../../core/models/points';

@Injectable({
    providedIn: 'root'
})
export class PointCalculatorService {

    constructor() {
    }

    calculatePoints(result: PointsCalculatorEntry, basePoint: number): number {
        const diff = Math.max(basePoint, result.opponentRanking) - Math.min(basePoint, result.opponentRanking);
        const isExpected = (result.opponentRanking > basePoint && result.victory === MATCH_RESULT.DEFEAT)
            || (result.opponentRanking < basePoint && result.victory === MATCH_RESULT.VICTORY);
        const pointsLimits: PointsBounding = this.findBoundingPoints(diff);
        const points: number = isExpected ? pointsLimits.expectedResult : pointsLimits.unexpectedResult;
        const {coefficient}: EventCoefficient = this.findCoefficientEvent(result.eventType, result.eventId);

        return points * coefficient * (result.victory === MATCH_RESULT.VICTORY ? 1 : -0.8);
    }

    findBoundingPoints(pointDiff: number): PointsBounding {
        return boundingPoints.find((boundingPoint: PointsBounding) =>
            boundingPoint.lowerBound <= pointDiff && boundingPoint.upperBound >= pointDiff
        );
    }

    findCoefficientEvent(eventType: EVENT_TYPE, eventId: string): EventCoefficient {
        return coefficientPerEvent[eventType].find((event) => event.eventId === eventId);
    }

}
