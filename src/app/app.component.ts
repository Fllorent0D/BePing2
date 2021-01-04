import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import '@capacitor-community/firebase-analytics';
import {Plugins} from '@capacitor/core';
import {AnalyticsService} from './core/services/firebase/analytics.service';
import {AdsService} from './core/services/firebase/ads.service';

const {FirebaseAnalytics} = Plugins;

@Component({
    selector: 'beping-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private analytics: AnalyticsService,
        private ads: AdsService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // @ts-ignore
        });
    }
}
