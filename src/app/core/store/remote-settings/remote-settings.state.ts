import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {RefreshRemoteConfig, UpdateRemoteSettingKey} from './remote-settings.action';
import {FirebaseRemoteConfig} from '@joinflux/firebase-remote-config';
import {environment} from '../../../../environments/environment';
import {CrashlyticsService} from '../../services/crashlytics.service';
import {InAppPurchasesState, InAppPurchaseStateModel} from '../in-app-purchases/in-app-purchases.state';


export interface RemoteSettingsStateModel {
    partnership_rotatio: boolean;
    current_season: number;
    tabt_url: string;
    beping_pro: boolean;
    use_member_lookup: boolean;
    maintenance: boolean;
    notifications: boolean;
    connectivity_issue: boolean;
}

const defaultState = {
    partnership_rotatio: false,
    current_season: 22,
    tabt_url: 'https://tabt-rest.floca.be',
    beping_pro: false,
    use_member_lookup: false,
    maintenance: false,
    notifications: false,
    connectivity_issue: false
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

    @Selector([RemoteSettingsState, InAppPurchasesState])
    static bepingProEnabled(remoteSettingsStateModel: RemoteSettingsStateModel, inAppPurchaseStateModel: InAppPurchaseStateModel): boolean {
        return !environment.production || inAppPurchaseStateModel.isPro || remoteSettingsStateModel.beping_pro;
    }

    @Selector([RemoteSettingsState])
    static tabtUrl(state: RemoteSettingsStateModel): string {
        return state.tabt_url;
    }

    @Selector([RemoteSettingsState])
    static notificationsEnabled(state: RemoteSettingsStateModel): boolean {
        return !environment.production || state.notifications;
    }

    @Selector([RemoteSettingsState])
    static maintenanceMode(state: RemoteSettingsStateModel): boolean {
        return true;
    }

    @Selector([RemoteSettingsState])
    static connectivityIssue(state: RemoteSettingsStateModel): boolean {
        return state.connectivity_issue;
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


        } catch (e) {
            this.crashlytics.recordException({message: 'Impossible to refresh remote config: ' + e?.message, stacktrace: e?.stack});
        }
    }

    @Action([RefreshRemoteConfig])
    async updateValues({dispatch}: StateContext<RemoteSettingsStateModel>) {
        const rotatio = await FirebaseRemoteConfig.getBoolean({key: 'partnership_rotatio'});
        const season = await FirebaseRemoteConfig.getNumber({key: 'current_season'});
        const bepingPro = await FirebaseRemoteConfig.getBoolean({key: 'beping_pro'});
        const tabtUrl = await FirebaseRemoteConfig.getString({key: 'tabt_url'});
        const memberLookup = await FirebaseRemoteConfig.getBoolean({key: 'use_member_lookup'});
        const maintenance = await FirebaseRemoteConfig.getBoolean({key: 'maintenance'});
        const notifications = await FirebaseRemoteConfig.getBoolean({key: 'notifications'});
        const connectivityIssue = await FirebaseRemoteConfig.getBoolean({key: 'connectivity_issue'});
        console.log('notifications:::', notifications);
        dispatch(new UpdateRemoteSettingKey('partnership_rotatio', rotatio.value));
        dispatch(new UpdateRemoteSettingKey('beping_pro', bepingPro.value));
        dispatch(new UpdateRemoteSettingKey('tabt_url', tabtUrl.value));
        dispatch(new UpdateRemoteSettingKey('current_season', season.value));
        dispatch(new UpdateRemoteSettingKey('use_member_lookup', memberLookup.value));
        dispatch(new UpdateRemoteSettingKey('maintenance', maintenance.value));
        dispatch(new UpdateRemoteSettingKey('notifications', notifications.value));
        dispatch(new UpdateRemoteSettingKey('connectivity_issue', connectivityIssue.value));
    }

    @Action([UpdateRemoteSettingKey])
    updateConf({patchState}: StateContext<RemoteSettingsStateModel>, {key, value}: UpdateRemoteSettingKey) {
        console.log('UPDATE KEY', key, value);
        return patchState({
            [key]: value
        });
    }


}
