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
        await Browser.open({url});
    }

    async openRegisterPage(internalPlayerId, internalClubId) {
        const url = new URL(window.location.href);
        console.log(window.location.href);
        url.pathname = '/assets/html/' + environment.internalPages.register;
        //url.protocol = 'http';
        url.searchParams.append('internalPlayerId', internalPlayerId);
        url.searchParams.append('internalClubId', internalClubId);
        console.log(url.href);
        await this.openInAppBrowser(url.href);
    }

}
