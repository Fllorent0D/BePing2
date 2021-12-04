export const pivotRankingEquivalence = 1400;

export interface RankingEquivalence {
    ranking: string;
    lowerBound: number;
    upperBound: number;
}

export const equivalenceRankingBelPos: RankingEquivalence[] = [
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

export const equivalenceRankingBelPts: RankingEquivalence[] = [
    {
        ranking: 'NC',
        lowerBound: 100,
        upperBound: 124,
    },
    {
        ranking: 'E6',
        lowerBound: 125,
        upperBound: 174,
    },
    {
        ranking: 'E4',
        lowerBound: 175,
        upperBound: 249,
    },
    {
        ranking: 'E2',
        lowerBound: 250,
        upperBound: 349,
    },
    {
        ranking: 'E0',
        lowerBound: 350,
        upperBound: 449,
    },
    {
        ranking: 'D6',
        lowerBound: 450,
        upperBound: 574,
    },
    {
        ranking: 'D4',
        lowerBound: 575,
        upperBound: 699,
    },
    {
        ranking: 'D2',
        lowerBound: 700,
        upperBound: 824,
    },
    {
        ranking: 'D0',
        lowerBound: 825,
        upperBound: 949,
    },
    {
        ranking: 'C6',
        lowerBound: 950,
        upperBound: 1099,
    },
    {
        ranking: 'C4',
        lowerBound: 1100,
        upperBound: 1249,
    },
    {
        ranking: 'C2',
        lowerBound: 1250,
        upperBound: 1399,
    }
];
