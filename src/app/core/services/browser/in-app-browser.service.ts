import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Browser} from '@capacitor/browser';
import {Store} from '@ngxs/store';
import {SettingsState} from '../../store/settings';
import {TABT_DATABASES} from '../../interceptors/tabt-database-interceptor.service';

@Injectable({
    providedIn: 'root'
})
export class InAppBrowserService {

    constructor(
        private readonly store: Store
    ) {
    }

    async openInAppBrowser(url: string) {
        await Browser.open({url, presentationStyle: 'popover'});
        Browser.removeAllListeners();
    }

    async openRegisterPage(internalPlayerId, internalClubId) {
        const url = new URL(environment.tabtUrl);
        url.protocol = 'http';
        url.pathname = environment.internalPages.basePath + environment.internalPages.registerRedirect;
        url.searchParams.append('internalPlayerId', internalPlayerId);
        url.searchParams.append('internalClubId', internalClubId);
        console.log(url.href);
        await this.openInAppBrowser(url.href);
    }

    async openTournamentRegistration(tournamentId: number): Promise<void> {
        const database: TABT_DATABASES = this.store.selectSnapshot(SettingsState.getCurrentDatabase);
        const urls = environment.tabtLinks[database];
        const url = new URL(window.location.href);
        url.protocol = 'https';
        url.port = '';
        url.host = urls.domain;
        url.pathname = urls.tournamentRegisterPath + '/' + tournamentId;
        console.log(url.href);
        await this.openInAppBrowser(url.href);
    }

}
