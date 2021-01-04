import {MemberEntry} from '../../api/models/member-entry';
import {ClubEntry} from '../../api/models/club-entry';
import {TeamMatchesEntry} from '../../api/models/team-matches-entry';

export class SetUser {
    static readonly type = '[user] Set user';

    constructor(
        public memberUniqueIndex: number,
        public club: ClubEntry
    ) {
    }
}

export class UpdateMemberEntries {
    static readonly type = '[user] Update member entries';

    constructor(
        public memberUniqueIndex: number
    ) {
    }
}

export class UpdateMemberEntriesSuccess {
    static readonly type = '[user] Update member entries success';

    constructor(
        public memberEntries: { [key: string]: MemberEntry }
    ) {
    }
}

export class UpdateMemberEntriesFailure {
    static readonly type = '[user] Update member entries failure';

    constructor(
        public memberEntries: { [key: string]: MemberEntry }
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

export class HasSeenOnBoarding {
    static readonly type = '[user] Has seen onboarding';
}

export class ResetOnBoarding {
    static readonly type = '[user] reset onboarding';
}
