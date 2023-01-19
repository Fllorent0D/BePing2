import {ClubsState} from './clubs';
import {UserState} from './user/user.state';
import {DivisionsState} from './divisions';
import {SeasonState} from './season';
import {TabTState} from './user/tabt.state';
import {FavoritesState} from './favorites';
import {SettingsState} from './settings';
import {PointsCalculatorState} from './points/points-calculator-state.service';
import {RemoteSettingsState} from './remote-settings';
import {InAppPurchasesState} from './in-app-purchases/in-app-purchases.state';
import {NotificationsState} from './notification-topics/notifications.state';
import {NumericRankingState} from './user';

export const states = [
    ClubsState,
    UserState,
    DivisionsState,
    SeasonState,
    TabTState,
    SettingsState,
    FavoritesState,
    PointsCalculatorState,
    RemoteSettingsState,
    InAppPurchasesState,
    NotificationsState,
    NumericRankingState
];
