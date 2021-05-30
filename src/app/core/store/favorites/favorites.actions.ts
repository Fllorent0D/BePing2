export class ToggleDivisionFromFavorites {
    static readonly type = '[divisions] toggle division from favorites';

    constructor(public divisionId: string) {
    }
}

export class ToggleClubFromFavorites {
    static readonly type = '[divisions] toggle club from favorites';

    constructor(public clubUniqueIndex: string) {
    }
}
