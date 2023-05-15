import {WeeklyNumericRankingV3} from '../../../api/models/weekly-numeric-ranking-v-3';

export class UpdateNumericRanking {
    static readonly type = '[Numeric Ranking] update numeric ranking';

    constructor(
        // Protection against data.afft.be bug. It will not update if the result of the update contains less results
        readonly forceUpdate: boolean,
    ) {
    }

}

export class UpdateNumericRankingSuccess {
    static readonly type = '[Numeric Ranking] update numeric ranking success';

    constructor(
        readonly points: { [key: string]: WeeklyNumericRankingV3 },
        readonly lastUpdate: Date,
        readonly forceUpdate: boolean,
    ) {
    }
}
