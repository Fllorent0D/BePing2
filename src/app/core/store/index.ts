import {ClubsState} from './clubs';
import {UserState} from './user/user.state';
import {DivisionsState} from './divisions';
import {SeasonState} from './season/season.state';
import {TabTState} from './user/tab-t-state.service';
import {FavoritesState} from './favorites';
import {SettingsState} from './settings';

export const states = [
    ClubsState,
    UserState,
    DivisionsState,
    SeasonState,
    TabTState,
    SettingsState,
    FavoritesState
];
