import {FavoriteItem} from './favorites.state';


export class ToggleClubFromFavorites {
    static readonly type = '[Favorites] toggle club from favorites';

    constructor(public payload: FavoriteItem<string>) {
    }
}

export class ToggleDivisionFromFavorites {
    static readonly type = '[Favorites] toggle division from favorites';

    constructor(public payload: FavoriteItem<number>) {
    }
}

export class ToggleMemberFromFavorites {
    static readonly type = '[Favorites] toggle member from favorites';

    constructor(public payload: FavoriteItem<number>) {
    }
}

export class ToggleTeamsFromFavorites {
    static readonly type = '[Favorites] toggle teams from favorites';

    constructor(public payload: FavoriteItem<string> ) {
    }
}
