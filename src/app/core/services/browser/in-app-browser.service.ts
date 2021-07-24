import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Browser} from '@capacitor/browser';

@Injectable({
    providedIn: 'root'
})
export class InAppBrowserService {

    constructor() {
    }

    async openInAppBrowser(url: string) {
        await Browser.open({url, presentationStyle: 'popover'});
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

}
