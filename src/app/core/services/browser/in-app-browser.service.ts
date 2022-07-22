import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Browser} from '@capacitor/browser';
import {Store} from '@ngxs/store';
import {SettingsState} from '../../store/settings';
import {TABT_DATABASES} from '../../interceptors/tabt-database-interceptor.service';
import {AnalyticsService} from '../firebase/analytics.service';
import {InternalIdentifiersService} from '../../api/services/internal-identifiers.service';

@Injectable({
    providedIn: 'root'
})
export class InAppBrowserService {

    constructor(
        private readonly store: Store,
        private readonly internalIdService: InternalIdentifiersService,
        private readonly analyticsService: AnalyticsService,
        private readonly analytics: AnalyticsService
    ) {
    }

    async openInAppBrowser(url: string) {
        await Browser.open({url, presentationStyle: 'popover'});
        Browser.removeAllListeners();
    }

    async openRegister(): Promise<void>;
    async openRegister(playerUniqueIndex: number, clubUniqueIndex: string): Promise<void>;
    async openRegister(playerUniqueIndex?: number, clubUniqueIndex?: string): Promise<void> {
        this.analyticsService.logEvent('register');
        const database: TABT_DATABASES = this.store.selectSnapshot(SettingsState.getCurrentDatabase);

        if (playerUniqueIndex && clubUniqueIndex) {
            const {url: redirectUrl} = await this.internalIdService.getRegisterLink({
                clubUniqueIndex,
                playerUniqueIndex,
                database
            }).toPromise();
            return this.openInAppBrowser(redirectUrl);
        }
        const urls = environment.tabtLinks[database];
        const url = new URL(window.location.href);
        url.protocol = 'https';
        url.port = '';
        url.host = urls.domain;
        url.pathname = urls.register;

        return this.openInAppBrowser(url.href);
    }

    async openForgotPwd() {
        this.analyticsService.logEvent('open_forgot_pwd');

        const database: TABT_DATABASES = this.store.selectSnapshot(SettingsState.getCurrentDatabase);
        if (database === TABT_DATABASES.VTTL) {
            return this.openInAppBrowser(environment.tabtLinks.vttl.resetPassword);
        } else {
            const url = new URL(window.location.href);
            const urls = environment.tabtLinks[database];

            url.protocol = 'https';
            url.port = '';
            url.host = urls.domain;
            url.pathname = '';
            url.searchParams.set('menu', '0');
            url.searchParams.set('lostpass', '1');
            return this.openInAppBrowser(url.href);
        }
    }

    async openTournamentRegistration(tournamentId: number): Promise<void> {
        this.analyticsService.logEvent('tournament_registration_open', {tournament: tournamentId});
        const database: TABT_DATABASES = this.store.selectSnapshot(SettingsState.getCurrentDatabase);
        const urls = environment.tabtLinks[database];
        const url = new URL(window.location.href);
        url.protocol = 'https';
        url.port = '';
        url.host = urls.domain;
        url.pathname = urls.tournamentRegisterPath + '/' + tournamentId;
        await this.openInAppBrowser(url.href);
    }

    async openRotatio() {
        this.analytics.logEvent('open_rotatio');
        await this.openInAppBrowser(environment.rotatioUrl);
    }

    async openBePingStatus() {
        this.analytics.logEvent('open_beping_status');
        await this.openInAppBrowser(environment.bepingStatus);
    }

    async openTTManager() {
        this.analytics.logEvent('open_tt_manager');
        await this.openInAppBrowser(environment.tt_manager);
    }

}
