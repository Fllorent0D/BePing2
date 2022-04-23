import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {RefreshRemoteConfig} from '../store/remote-settings';

@Injectable({
    providedIn: 'root'
})
export class RemoteConfigService {

    constructor(
        private readonly store: Store
    ) {
    }

    refreshRemoteConfig() {
        this.store.dispatch(new RefreshRemoteConfig());
    }
}
