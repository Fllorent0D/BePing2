import {ClubsState} from './clubs';
import {UserState} from './user/user.state';
import {DivisionsState} from './divisions';
import {SeasonState} from './season';
import {TabTState} from './user/tab-t-state.service';
import {FavoritesState} from './favorites';
import {SettingsState} from './settings';
import {PointsCalculatorState} from './points/points-calculator-state.service';

export const states = [
    ClubsState,
    UserState,
    DivisionsState,
    SeasonState,
    TabTState,
    SettingsState,
    FavoritesState,
    PointsCalculatorState
];
