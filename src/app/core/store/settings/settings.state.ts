import {LANG} from '../../models/langs';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {TranslateService} from '@ngx-translate/core';
import {Device} from '@capacitor/device';
import {SetTheme, ToggleDisplayELO, ToggleDisplayNumericRanking, UpdateCurrentLang, UpdateCurrentLangSuccess} from './settings.actions';
import {Injectable} from '@angular/core';
import {AFTT_CLUB_CATEGORIES, TABT_DATABASES, VTTL_CLUB_CATEGORIES} from '../../interceptors/tabt-database-interceptor.service';
import {AnalyticsService} from '../../services/firebase/analytics.service';
import {UserState, UserStateModel} from '../user/user.state';
import {SetUser, UpdateClubEntry} from '../user/user.actions';

export enum THEME {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto'
}

export interface SettingsStateModel {
    theme: THEME;
    lang?: LANG;
    displayELO: boolean;
    displayNumericRanking: boolean;
}


@State<SettingsStateModel>({
    name: 'settings',
    defaults: {
        theme: THEME.LIGHT,
        lang: null,
        displayELO: false,
        displayNumericRanking: true
    }
})
@Injectable()
export class SettingsState implements NgxsOnInit {
    constructor(
        private readonly translateService: TranslateService,
    ) {
    }

    @Selector([SettingsState])
    static getCurrentLang(state: SettingsStateModel): LANG {
        return state.lang;
    }

    @Selector([SettingsState])
    static displayELO(state: SettingsStateModel): boolean {
        return state.displayELO;
    }

    @Selector([SettingsState])
    static displayNumericRanking(state: SettingsStateModel): boolean {
        return state.displayNumericRanking;
    }

    @Selector([UserState])
    static getCurrentDatabase(state: UserStateModel): TABT_DATABASES {
        if (VTTL_CLUB_CATEGORIES.includes(state?.club?.Category)) {
            return TABT_DATABASES.VTTL;
        }
        return TABT_DATABASES.AFTT;
    }

    @Selector([SettingsState])
    static getCurrentTheme(state: SettingsStateModel): THEME {
        return state.theme;
    }

    ngxsOnInit({getState, dispatch}: StateContext<SettingsStateModel>): void {
        const state = getState();

        if (!state.lang) {
            Device.getLanguageCode().then((langCode) => {
                const lang: string = langCode.value.slice(0, 2);
                switch (lang) {
                    case LANG.NL:
                        dispatch(new UpdateCurrentLang(LANG.NL));
                        break;
                    case LANG.FR:
                        dispatch(new UpdateCurrentLang(LANG.FR));
                        break;
                    default:
                        dispatch(new UpdateCurrentLang(LANG.EN));
                }
            });
        } else {
            this.translateService.setDefaultLang(state.lang);
            this.translateService.use(state.lang);
        }
    }

    @Action(UpdateCurrentLang)
    updateCurrentLang({patchState, dispatch}: StateContext<SettingsStateModel>, action: UpdateCurrentLang) {
        this.translateService.use(action.lang);

        patchState({
            lang: action.lang
        });

        return dispatch(new UpdateCurrentLangSuccess());
    }

    @Action(ToggleDisplayELO)
    toggleDisplayElo({patchState, dispatch}: StateContext<SettingsStateModel>, action: ToggleDisplayELO) {
        return patchState({
            displayELO: action.display
        });
    }

    @Action(ToggleDisplayNumericRanking)
    toggleDisplayNumericRanking({patchState, dispatch}: StateContext<SettingsStateModel>, action: ToggleDisplayNumericRanking) {
        return patchState({
            displayNumericRanking: action.display
        });
    }

    @Action([UpdateClubEntry, SetUser])
    updateSettingClubUpdate({patchState, dispatch}: StateContext<SettingsStateModel>, {club}: UpdateClubEntry | SetUser) {
        return patchState({
            displayELO: VTTL_CLUB_CATEGORIES.includes(club.Category),
            displayNumericRanking: AFTT_CLUB_CATEGORIES.includes(club.Category)
        });
    }


    @Action(SetTheme)
    updateTheme({patchState}: StateContext<SettingsStateModel>, action: SetTheme) {
        if (action.theme === THEME.LIGHT) {
            document.body.classList.remove('dark');
        } else if (action.theme === THEME.DARK) {
            document.body.classList.add('dark');
        }
        return patchState({
            theme: action.theme
        });
    }

}
