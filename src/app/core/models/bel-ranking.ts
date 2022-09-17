import {PLAYER_CATEGORY} from './user';

export const pivotRankingEquivalenceMen = 1575;
export const pivotRankingEquivalenceWomen = 745;

export interface RankingEquivalence {
    ranking: string;
    lowerBound: number;
    upperBound: number;
}

export const equivalenceRankingBelPosMen: RankingEquivalence[] = [
    {
        ranking: 'C0',
        lowerBound: 1001,
        upperBound: Infinity,
    },
    {
        ranking: 'B6',
        lowerBound: 501,
        upperBound: 1000,
    },
    {
        ranking: 'B4',
        lowerBound: 226,
        upperBound: 500,
    },
    {
        ranking: 'B2',
        lowerBound: 76,
        upperBound: 225,
    },
    {
        ranking: 'B0',
        lowerBound: 21,
        upperBound: 75,
    },
    {
        ranking: 'A',
        lowerBound: 1,
        upperBound: 20,
    },
];

export const equivalenceRankingBelPosWomen: RankingEquivalence[] = [
    {
        ranking: 'C0',
        lowerBound: 121,
        upperBound: Infinity,
    },
    {
        ranking: 'B6',
        lowerBound: 86,
        upperBound: 120,
    },
    {
        ranking: 'B4',
        lowerBound: 56,
        upperBound: 85,
    },
    {
        ranking: 'B2',
        lowerBound: 36,
        upperBound: 55,
    },
    {
        ranking: 'B0',
        lowerBound: 16,
        upperBound: 35,
    },
    {
        ranking: 'A',
        lowerBound: 1,
        upperBound: 15,
    },
];

export const equivalenceRankingBelPtsMen: RankingEquivalence[] = [
    {
        ranking: 'NC',
        lowerBound: 100,
        upperBound: 124,
    },
    {
        ranking: 'E6',
        lowerBound: 125,
        upperBound: 249,
    },
    {
        ranking: 'E4',
        lowerBound: 250,
        upperBound: 374,
    },
    {
        ranking: 'E2',
        lowerBound: 375,
        upperBound: 499,
    },
    {
        ranking: 'E0',
        lowerBound: 500,
        upperBound: 624
    },
    {
        ranking: 'D6',
        lowerBound: 625,
        upperBound: 749,
    },
    {
        ranking: 'D4',
        lowerBound: 750,
        upperBound: 874,
    },
    {
        ranking: 'D2',
        lowerBound: 875,
        upperBound: 999,
    },
    {
        ranking: 'D0',
        lowerBound: 1000,
        upperBound: 1124,
    },
    {
        ranking: 'C6',
        lowerBound: 1125,
        upperBound: 1274,
    },
    {
        ranking: 'C4',
        lowerBound: 1275,
        upperBound: 1424,
    },
    {
        ranking: 'C2',
        lowerBound: 1425,
        upperBound: 1574,
    },
    {
        ranking: 'C0',
        lowerBound: pivotRankingEquivalenceMen,
        upperBound: Infinity,
    }
];

export const equivalenceRankingBelPtsWomen: RankingEquivalence[] = [
    {
        ranking: 'NC',
        lowerBound: 100,
        upperBound: 124,
    },
    {
        ranking: 'D6',
        lowerBound: 125,
        upperBound: 204,
    },
    {
        ranking: 'D4',
        lowerBound: 205,
        upperBound: 284,
    },
    {
        ranking: 'D2',
        lowerBound: 285,
        upperBound: 364,
    },
    {
        ranking: 'D0',
        lowerBound: 365,
        upperBound: 444,
    },
    {
        ranking: 'C6',
        lowerBound: 445,
        upperBound: 544,
    },
    {
        ranking: 'C4',
        lowerBound: 545,
        upperBound: 644,
    },
    {
        ranking: 'C2',
        lowerBound: 645,
        upperBound: 744,
    },
    {
        ranking: 'C0',
        lowerBound: pivotRankingEquivalenceWomen,
        upperBound: Infinity,
    }
];

export const findBoundPts = (pts: number, category: PLAYER_CATEGORY): RankingEquivalence =>
    (category === PLAYER_CATEGORY.MEN ? equivalenceRankingBelPtsMen : equivalenceRankingBelPtsWomen).find(
        ({upperBound, lowerBound}) => pts >= lowerBound && pts <= upperBound
    );

export interface EquivalenceTables {
    equivalenceRankingBelPts: RankingEquivalence[];
    equivalenceRankingBelPos: RankingEquivalence[];
    pivotRankingEquivalence: number;
}
