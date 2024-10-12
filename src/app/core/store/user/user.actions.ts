import {ClubEntry} from '../../api/models/club-entry';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';
import {UserMemberEntries} from './user.state';
import {PLAYER_CATEGORY} from '../../models/user';
import {WeeklyNumericRanking} from '../../api/models/weekly-numeric-ranking';
import {WeeklyNumericRankingV2} from '../../api/models/weekly-numeric-ranking-v-2';

export class SetUser {
    static readonly type = '[user] Set user';

    constructor(
        public memberUniqueIndex: number,
        public club: ClubEntry
    ) {
    }
}

export class ClubTransfer {
    static readonly type = '[user] club has changed';

    constructor(
        public newClubIndex: string
    ) {
    }
}

export class UpdateClubEntry {
    static readonly type = '[user] update club';

    constructor(
        public club: ClubEntry
    ) {
    }
}

export class UpdateMemberEntries {
    static readonly type = '[user] Update member entries';

    constructor(
        public memberUniqueIndex: number,
        // Protection against TabT bug. It will not update if the result of the update contains less results
        public forceUpdate: boolean = false
    ) {
    }
}

export class UpdateMemberEntriesSuccess {
    static readonly type = '[user] Update member entries success';

    constructor(
        public memberEntries: UserMemberEntries,
        public forceUpdate: boolean = false
    ) {
    }
}


export class UpdateNumericRankingsSuccess {
    static readonly type = '[user] Get numeric rankings success';

    constructor(
        public memberEntries: UserMemberEntries
    ) {
    }
}

export class UpdateWeeklyEloSuccess {
    static readonly type = '[user] Update weekly elo success';

    constructor(
        public elo: WeeklyNumericRankingV2[]
    ) {
    }
}

export class UpdateWeeklyNumericRankingSuccess {
    static readonly type = '[user] Update weekly numeric ranking success';

    constructor(
        public numericRankings: WeeklyNumericRanking[]
    ) {
    }
}

export class UpdateMemberEntriesFailure {
    static readonly type = '[user] Update member entries failure';

    constructor(
        public memberEntries: UserMemberEntries
    ) {
    }
}

export class UpdateLatestMatchesSuccess {
    static readonly type = '[user] Update latest matches success';

    constructor(
        public latestMatches: { [key: string]: TeamMatchesEntry[] }
    ) {
    }
}

export class UpdateMainCategory {
    static readonly type = '[user] Update main category';

    constructor(
        public category: PLAYER_CATEGORY
    ) {
    }
}

export class SetLoading {
    static readonly type = '[user] set loading';

    constructor(
        public loading: boolean
    ) {
    }
}


export class HasSeenOnBoarding {
    static readonly type = '[user] Has seen onboarding';
}

export class ResetOnBoarding {
    static readonly type = '[user] reset onboarding';
}
