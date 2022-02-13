import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UpdateRemoteSettingKey} from './remote-settings.action';
import {FirebaseRemoteConfig} from '@joinflux/firebase-remote-config';


export interface RemoteSettingsStateModel {
    partnership_rotatio: boolean;
    current_season: number;
    beping_pro: boolean;
}

const defaultState = {
    partnership_rotatio: false,
    current_season: 22,
    beping_pro: true
};

@State<RemoteSettingsStateModel>({
    name: 'remoteSettings',
    defaults: defaultState
})
@Injectable()
export class RemoteSettingsState implements NgxsOnInit {

    @Selector([RemoteSettingsState])
    static partnershipRotatio(state: RemoteSettingsStateModel): boolean {
        return state.partnership_rotatio;
    }

    @Selector([RemoteSettingsState])
    static bepingProEnabled(state: RemoteSettingsStateModel): boolean {
        return state.beping_pro;
    }

    async ngxsOnInit(ctx?: StateContext<RemoteSettingsStateModel>): Promise<void> {
        try {
            FirebaseRemoteConfig.initialize({minimumFetchInterval: 86_400, fetchTimeout: 60});
            await FirebaseRemoteConfig.setDefaultConfig(defaultState);
            await FirebaseRemoteConfig.fetchAndActivate();
            const rotatio = await FirebaseRemoteConfig.getBoolean({key: 'partnership_rotatio'});
            const season = await FirebaseRemoteConfig.getNumber({key: 'current_season'});
            const bepingPro = await FirebaseRemoteConfig.getBoolean({key: 'beping_pro'});
            console.log(bepingPro);
            ctx.dispatch(new UpdateRemoteSettingKey('partnership_rotatio', rotatio.value));
            // ctx.dispatch(new UpdateRemoteSettingKey('beping_pro', bepingPro.value));
            ctx.dispatch(new UpdateRemoteSettingKey('beping_pro', true));
            ctx.dispatch(new UpdateRemoteSettingKey('current_season', season.value));

        } catch (e) {
            console.log('ERROR:::', e);
        }
    }

    @Action([UpdateRemoteSettingKey])
    updateConf({patchState}: StateContext<RemoteSettingsStateModel>, {key, value}: UpdateRemoteSettingKey): void {
        patchState({
            [key]: value
        });
    }


}
