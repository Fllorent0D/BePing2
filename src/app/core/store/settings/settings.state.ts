import {LANG} from '../../models/langs';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {TranslateService} from '@ngx-translate/core';
import {Device} from '@capacitor/device';
import {SetTheme, UpdateCurrentLang, UpdateCurrentLangSuccess} from './settings.actions';
import {Injectable} from '@angular/core';
import {TABT_DATABASES} from '../../interceptors/tabt-database-interceptor.service';

export enum THEME {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto'
}

export interface SettingsStateModel {
    theme: THEME;
    lang?: LANG;
}


@State<SettingsStateModel>({
    name: 'settings',
    defaults: {
        theme: THEME.LIGHT,
        lang: null
    }
})
@Injectable()
export class SettingsState implements NgxsOnInit {
    @Selector([SettingsState])
    static getCurrentLang(state: SettingsStateModel): LANG {
        return state.lang;
    }

    @Selector([SettingsState])
    static getCurrentDatabase(state: SettingsStateModel): TABT_DATABASES {
        switch (state.lang) {
            case LANG.NL:
                return TABT_DATABASES.VTTL;
            case LANG.FR:
            default:
                return TABT_DATABASES.AFTT;
        }
    }

    @Selector([SettingsState])
    static getCurrentTheme(state: SettingsStateModel): THEME {
        return state.theme;
    }

    constructor(
        private readonly translateService: TranslateService
    ) {
    }

    ngxsOnInit({getState, dispatch}: StateContext<SettingsStateModel>): void {
        const state = getState();

        if (!state.lang) {
            Device.getLanguageCode().then((langCode) => {
                const lang: string = langCode.value.slice(0, 2);
                dispatch(new UpdateCurrentLang(lang === LANG.NL ? LANG.NL : LANG.FR));
            });
        } else {
            this.translateService.setDefaultLang(state.lang);
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
