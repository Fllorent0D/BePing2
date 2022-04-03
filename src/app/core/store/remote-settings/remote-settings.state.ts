import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UpdateRemoteSettingKey} from './remote-settings.action';
import {FirebaseRemoteConfig} from '@joinflux/firebase-remote-config';
import {environment} from '../../../../environments/environment';
import {CrashlyticsService} from '../../services/crashlytics.service';


export interface RemoteSettingsStateModel {
    partnership_rotatio: boolean;
    current_season: number;
    tabt_url: string;
    beping_pro: boolean;
    use_member_lookup: boolean;
}

const defaultState = {
    partnership_rotatio: false,
    current_season: 22,
    tabt_url: 'https://tabt-rest.floca.be',
    beping_pro: true,
    use_member_lookup: false
};

@State<RemoteSettingsStateModel>({
    name: 'remoteSettings',
    defaults: defaultState
})
@Injectable()
export class RemoteSettingsState implements NgxsOnInit {
    isWeb = false;

    @Selector([RemoteSettingsState])
    static partnershipRotatio(state: RemoteSettingsStateModel): boolean {
        return state.partnership_rotatio;
    }

    @Selector([RemoteSettingsState])
    static useMemberLookup(state: RemoteSettingsStateModel): boolean {
        return !environment.production || state.use_member_lookup;
    }

    @Selector([RemoteSettingsState])
    static bepingProEnabled(state: RemoteSettingsStateModel): boolean {
        return !environment.production || state.beping_pro;
    }

    @Selector([RemoteSettingsState])
    static tabtUrl(state: RemoteSettingsStateModel): string {
        return state.tabt_url;
    }

    constructor(
        private readonly crashlytics: CrashlyticsService
    ) {
    }

    async ngxsOnInit(ctx?: StateContext<RemoteSettingsStateModel>): Promise<void> {
        try {
            FirebaseRemoteConfig.initialize({minimumFetchInterval: 43_200, fetchTimeout: 60});
            await FirebaseRemoteConfig.setDefaultConfig(defaultState);
            await FirebaseRemoteConfig.fetchAndActivate();
            const rotatio = await FirebaseRemoteConfig.getBoolean({key: 'partnership_rotatio'});
            const season = await FirebaseRemoteConfig.getNumber({key: 'current_season'});
            const bepingPro = await FirebaseRemoteConfig.getBoolean({key: 'beping_pro'});
            const tabtUrl = await FirebaseRemoteConfig.getString({key: 'tabt_url'});
            const memberLookup = await FirebaseRemoteConfig.getBoolean({key: 'use_member_lookup'});
            // console.log(bepingPro);
            ctx.dispatch(new UpdateRemoteSettingKey('partnership_rotatio', rotatio.value));
            ctx.dispatch(new UpdateRemoteSettingKey('beping_pro', bepingPro.value));
            ctx.dispatch(new UpdateRemoteSettingKey('tabt_url', tabtUrl.value));
            ctx.dispatch(new UpdateRemoteSettingKey('current_season', season.value));
            ctx.dispatch(new UpdateRemoteSettingKey('use_member_lookup', memberLookup.value));

        } catch (e) {
            this.crashlytics.recordException({message: 'Impossible to refresh remote config: ' + e?.message, stacktrace: e?.stack});
        }
    }

    @Action([UpdateRemoteSettingKey])
    updateConf({patchState}: StateContext<RemoteSettingsStateModel>, {key, value}: UpdateRemoteSettingKey) {
        console.log('UPDATE KEY', key, value);
        return patchState({
            [key]: value
        });
    }


}
