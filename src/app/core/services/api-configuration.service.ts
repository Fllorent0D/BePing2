import {Injectable} from '@angular/core';
import {ApiConfigurationParams} from '../api/api-configuration';
import {environment} from '../../../environments/environment';
import {Store} from '@ngxs/store';
import {RemoteSettingsState} from '../store/remote-settings';

@Injectable({
    providedIn: 'root'
})
export class ApiConfigurationService implements ApiConfigurationParams {
    rootUrl = environment.tabtUrl;

    constructor(
        private readonly store: Store
    ) {
        this.store.select(RemoteSettingsState.tabtUrl).subscribe(url => {
            if (url && environment.production) {
                this.rootUrl = url;
            } else {
                this.rootUrl = environment.tabtUrl;
            }
        });
    }
}
