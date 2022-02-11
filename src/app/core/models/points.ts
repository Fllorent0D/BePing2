export interface PointsBounding {
    lowerBound: number;
    upperBound: number;
    expectedResult: number;
    unexpectedResult: number;
}

export enum EVENT_TYPE {
    TOURNAMENT = 'tournament',
    CHAMPIONSHIP = 'championship'
}

export enum MATCH_RESULT {
    VICTORY = 'victory',
    DEFEAT = 'defeat'
}

export interface EventCoefficient {
    eventId: string;
    coefficient: number;
}

export const coefficientPerEventMen: { [key: string]: EventCoefficient[] } = {
    [EVENT_TYPE.TOURNAMENT]: [
        {
            eventId: 'R1',
            coefficient: 2.5,
        },
        {
            eventId: 'R2',
            coefficient: 2.2,
        },
        {
            eventId: 'R3',
            coefficient: 1.5,
        },
        {
            eventId: 'R4',
            coefficient: 1.2,
        },
        {
            eventId: 'R5',
            coefficient: 1,
        },
    ],
    [EVENT_TYPE.CHAMPIONSHIP]: [
        {
            eventId: 'R2',
            coefficient: 2.2,
        },
        {
            eventId: 'R5',
            coefficient: 1,
        },
        {
            eventId: 'R6',
            coefficient: 0.95,
        },
        {
            eventId: 'R7',
            coefficient: 0.9,
        },
        {
            eventId: 'R8',
            coefficient: 0.85,
        }
    ]
};

export const coefficientPerEventWomen: { [key: string]: EventCoefficient[] } = {
    [EVENT_TYPE.TOURNAMENT]: [
        {
            eventId: 'R2',
            coefficient: 2.2,
        },
        {
            eventId: 'R3',
            coefficient: 1.5,
        },
        {
            eventId: 'R4',
            coefficient: 1.5,
        },
        {
            eventId: 'R5',
            coefficient: 1,
        },
    ],
    [EVENT_TYPE.CHAMPIONSHIP]: [
        {
            eventId: 'R3',
            coefficient: 1.5,
        },
        {
            eventId: 'R4',
            coefficient: 1.2,
        },
        {
            eventId: 'R5',
            coefficient: 1,
        },
        {
            eventId: 'R6',
            coefficient: 0.95,
        },
        {
            eventId: 'R7',
            coefficient: 0.9,
        },
        {
            eventId: 'R8',
            coefficient: 0.85,
        }
    ]
};

export const boundingPointsMen: PointsBounding[] = [
    {
        lowerBound: 0,
        upperBound: 25,
        expectedResult: 9,
        unexpectedResult: 10
    },
    {
        lowerBound: 26,
        upperBound: 50,
        expectedResult: 8,
        unexpectedResult: 12
    },
    {
        lowerBound: 51,
        upperBound: 75,
        expectedResult: 7,
        unexpectedResult: 14
    },
    {
        lowerBound: 76,
        upperBound: 100,
        expectedResult: 6,
        unexpectedResult: 16
    },
    {
        lowerBound: 101,
        upperBound: 150,
        expectedResult: 5,
        unexpectedResult: 18
    },
    {
        lowerBound: 151,
        upperBound: 200,
        expectedResult: 4,
        unexpectedResult: 20
    },
    {
        lowerBound: 201,
        upperBound: 250,
        expectedResult: 3,
        unexpectedResult: 24
    },
    {
        lowerBound: 251,
        upperBound: 300,
        expectedResult: 2,
        unexpectedResult: 28
    },
    {
        lowerBound: 301,
        upperBound: 400,
        expectedResult: 1,
        unexpectedResult: 32
    },
    {
        lowerBound: 401,
        upperBound: Infinity,
        expectedResult: 0,
        unexpectedResult: 40
    },
];
export const boundingPointsWomen: PointsBounding[] = [
    {
        lowerBound: 0,
        upperBound: 25,
        expectedResult: 9,
        unexpectedResult: 10
    },
    {
        lowerBound: 26,
        upperBound: 50,
        expectedResult: 8,
        unexpectedResult: 12
    },
    {
        lowerBound: 51,
        upperBound: 75,
        expectedResult: 7,
        unexpectedResult: 14
    },
    {
        lowerBound: 76,
        upperBound: 100,
        expectedResult: 6,
        unexpectedResult: 16
    },
    {
        lowerBound: 101,
        upperBound: 150,
        expectedResult: 5,
        unexpectedResult: 18
    },
    {
        lowerBound: 151,
        upperBound: 200,
        expectedResult: 4,
        unexpectedResult: 20
    },
    {
        lowerBound: 201,
        upperBound: 250,
        expectedResult: 3,
        unexpectedResult: 24
    },
    {
        lowerBound: 251,
        upperBound: 300,
        expectedResult: 2,
        unexpectedResult: 28
    },
    {
        lowerBound: 301,
        upperBound: 400,
        expectedResult: 1,
        unexpectedResult: 32
    },
    {
        lowerBound: 401,
        upperBound: Infinity,
        expectedResult: 0,
        unexpectedResult: 40
    },
];
