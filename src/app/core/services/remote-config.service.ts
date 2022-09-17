import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {RefreshRemoteConfig, remoteConfigDefaultState} from '../store/remote-settings';
import {FirebaseRemoteConfig} from '@joinflux/firebase-remote-config';
import {CrashlyticsService} from './crashlytics.service';

@Injectable({
    providedIn: 'root'
})
export class RemoteConfigService {

    constructor(
        private readonly store: Store,
        private readonly crashlytics: CrashlyticsService
    ) {
    }

    async init(): Promise<void> {
        try {
            await FirebaseRemoteConfig.initialize();
            await FirebaseRemoteConfig.setDefaultConfig(remoteConfigDefaultState);
            await FirebaseRemoteConfig.fetchAndActivate();
            this.refreshRemoteConfig();
        } catch (e) {
            this.crashlytics.recordException({message: 'Error when loading remote config plugin: ' + e.message});
        }

    }

    refreshRemoteConfig() {
        return this.store.dispatch(new RefreshRemoteConfig());
    }
}
