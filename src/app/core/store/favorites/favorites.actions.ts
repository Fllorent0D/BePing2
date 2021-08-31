import {ClubEntry} from '../../api/models/club-entry';
import {DivisionEntry} from '../../api/models/division-entry';
import {MemberEntry} from '../../api/models/member-entry';


export class ToggleClubFromFavorites {
    static readonly type = '[Favorites] toggle club from favorites';

    constructor(public payload: ClubEntry) {
    }
}

export class ToggleDivisionFromFavorites {
    static readonly type = '[Favorites] toggle division from favorites';

    constructor(public payload: DivisionEntry) {
    }
}

export class ToggleMemberFromFavorites {
    static readonly type = '[Favorites] toggle member from favorites';

    constructor(public payload: MemberEntry) {
    }
}
