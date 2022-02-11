import {Injectable} from '@angular/core';
import {RankingPointsEntry} from '../../api/models/ranking-points-entry';
import {
    equivalenceRankingBelPosMen,
    equivalenceRankingBelPosWomen,
    equivalenceRankingBelPtsMen,
    equivalenceRankingBelPtsWomen,
    EquivalenceTables,
    pivotRankingEquivalenceMen,
    pivotRankingEquivalenceWomen,
    RankingEquivalence
} from '../../models/bel-ranking';
import {PLAYER_CATEGORY} from '../../models/user';

export enum RankingMethodName {
    ELO = 'ELO',
    AILE_FRANCOPHONE = 'A_F',
    BEL_POINTS = 'BEL/pts',
    BEL_RANKING = 'BEL/pos'
}


@Injectable({
    providedIn: 'root'
})
export class RankingService {

    constructor() {
    }

    static isRankingHigher(a: string, b: string) {
        if (a === b) {
            return false;
        }
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const letterA = alphabet.indexOf(a.charAt(0).toLowerCase());
        const letterB = alphabet.indexOf(b.charAt(0).toLowerCase());
        const numberA = Number(a.replace(/\D/g, ''));
        const numberB = Number(b.replace(/\D/g, ''));
        if (letterA === letterB) {
            return numberA < numberB;
        }

        return letterA < letterB;

    }


    getEquivalentRanking(points: number, position: number, category: PLAYER_CATEGORY): string {
        const {equivalenceRankingBelPos, equivalenceRankingBelPts, pivotRankingEquivalence} = this.getEquivalenceTableForCategory(category);

        const [pts, equivalenceTable] = points < pivotRankingEquivalence ?
            [Math.round(points), equivalenceRankingBelPts] :
            [position, equivalenceRankingBelPos];

        const bound: RankingEquivalence = equivalenceTable.find(
            ({upperBound, lowerBound}) => pts >= lowerBound && pts <= upperBound
        );

        if (bound?.ranking === 'A') {
            return 'A' + position;
        }
        return bound?.ranking ?? '?';
    }

    getEquivalenceTableForCategory(category: PLAYER_CATEGORY): EquivalenceTables {

        switch (category) {
            case PLAYER_CATEGORY.MEN:
            case PLAYER_CATEGORY.VETERANS:
            case PLAYER_CATEGORY.YOUTH:
                return {
                    equivalenceRankingBelPts: equivalenceRankingBelPtsMen,
                    equivalenceRankingBelPos: equivalenceRankingBelPosMen,
                    pivotRankingEquivalence: pivotRankingEquivalenceMen
                };
            case PLAYER_CATEGORY.VETERANS_WOMEN:
            case PLAYER_CATEGORY.WOMEN:
                return {
                    equivalenceRankingBelPts: equivalenceRankingBelPtsWomen,
                    equivalenceRankingBelPos: equivalenceRankingBelPosWomen,
                    pivotRankingEquivalence: pivotRankingEquivalenceWomen
                };
        }
    }

    getELOPoints(rankings: RankingPointsEntry[]): string {
        const ranking = rankings.find(r => r.MethodName === RankingMethodName.ELO);
        if (ranking) {
            return ranking.Value;
        }
        return undefined;
    }

    getPoints(rankings: RankingPointsEntry[], rankingMethod: RankingMethodName): number {
        const ranking = rankings.find(r => r.MethodName === rankingMethod);
        if (ranking) {
            return Number(ranking.Value);
        }
        return undefined;
    }

    getNextRanking(rankings: RankingPointsEntry[]): string {
        const ranking = rankings.find(r => r.MethodName === RankingMethodName.AILE_FRANCOPHONE);
        if (ranking) {
            return ranking.Value;
        }
        return undefined;
    }
}
