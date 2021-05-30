import {Injectable} from '@angular/core';
import {RankingPointsEntry} from '../../api/models/ranking-points-entry';

export enum RankingMethodName {
    ELO = 'ELO',
    AILE_FRANCOPHONE = 'A_F'
}


@Injectable({
    providedIn: 'root'
})
export class RankingService {

    constructor() {
    }


    getELOPoints(rankings: RankingPointsEntry[]): string {
        const ranking = rankings.find(r => r.MethodName === RankingMethodName.ELO);
        if (ranking) {
            return ranking.Value;
        }
        return '?';
    }

    getNextRanking(rankings: RankingPointsEntry[]): string {
        const ranking = rankings.find(r => r.MethodName === RankingMethodName.AILE_FRANCOPHONE);
        if (ranking) {
            return ranking.Value;
        }
        return '?';
    }


}
