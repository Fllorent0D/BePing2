import {LANG} from '../../models/langs';
import {THEME} from './settings.state';

export class UpdateCurrentLang {
    static readonly type = '[user] Update current lang';

    constructor(
        public lang: LANG
    ) {
    }
}

export class UpdateCurrentLangSuccess {
    static readonly type = '[settings] Update current lang success';
}

export class SetTheme {
    static readonly type = '[settings] Set Theme';

    constructor(
        public theme: THEME
    ) {
    }
}

export class ToggleDisplayELO {
    static readonly type = '[settings] Toggle Display ELO';

    constructor(
        public display: boolean
    ) {
    }
}

export class ToggleDisplayNumericRanking {
    static readonly type = '[settings] Toggle Display numeric ranking';

    constructor(
        public display: boolean
    ) {
    }
}

