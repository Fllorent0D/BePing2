import {Injectable, NgZone} from '@angular/core';
import {App, URLOpenListenerEvent} from '@capacitor/app';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {TabsNavigationService} from './navigation/tabs-navigation.service';

@Injectable({
    providedIn: 'root'
})
export class DeepLinkService {

    constructor(
        private readonly router: Router,
        private readonly zone: NgZone,
        private readonly modalCtrl: ModalController,
        private readonly tabNavigator: TabsNavigationService
    ) {
    }

    async init() {
        App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
            this.zone.run(() => this.redirect(event.url));
        });
    }

    async redirect(urlOpened: string) {
        const matchSlug = /^\/match\/([0-9]+)$/;
        const divisionSlug = /^\/division\/([0-9]+)$/;
        const playerSlug = /^\/player\/([0-9]+)$/;
        const clubSlug = /^\/club\/([A-Za-z0-9\-]+)$/;
        const teamSlug = /^\/club\/([A-Za-z0-9\-]+)\/([A-Za-z0-9\-]+)$/;
        await this.router.navigateByUrl('/tabs/homeTab/home');

        const slug = urlOpened.split('.be').pop();
        if (matchSlug.test(slug)) {
            const matches = slug.match(matchSlug);
            await this.tabNavigator.navigateTo(['team-match-details', matches[1]]);
        } else if (divisionSlug.test(slug)) {
            const matches = slug.match(divisionSlug);
            await this.tabNavigator.navigateTo(['divisions', matches[1]]);
        } else if (playerSlug.test(slug)) {
            const matches = slug.match(playerSlug);
            await this.tabNavigator.navigateTo(['player', matches[1]]);
        } else if (clubSlug.test(slug)) {
            const matches = slug.match(clubSlug);
            await this.tabNavigator.navigateTo(['clubs', matches[1]]);
        } else if (teamSlug.test(slug)) {
            const matches = slug.match(teamSlug);
            await this.tabNavigator.navigateTo(['clubs', matches[1], 'team', matches[2]]);
        }
    }
}
