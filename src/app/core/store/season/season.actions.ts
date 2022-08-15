import {SeasonEntry} from '../../api/models/season-entry';

export class CurrentSeasonChanged {
    static readonly type = '[season] get current season success';

    constructor(
        public season: SeasonEntry
    ) {
    }
}

export class GetCurrentSeasonFailure {
    static readonly type = '[season] get current season failure';

    constructor(
        public error: Error
    ) {
    }
}

export class GetCurrentSeason {
    static readonly type = '[season] get current season';
}

export class SetSeasonLoading {
    static readonly type = '[season] set season loading';

    constructor(
        public loading: boolean
    ) {
    }
}

export class LoadSpecificSeason {
    static readonly type = '[season] set specific season loading';

    constructor(
        public seasonId: number
    ) {
    }
}
