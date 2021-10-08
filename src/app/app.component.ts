import {Component, ViewChild} from '@angular/core';

import {IonRouterOutlet, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import '@capacitor-community/firebase-analytics';
import {App} from '@capacitor/app';
import {BackButtonEvent} from '@ionic/core';

@Component({
    selector: 'beping-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    @ViewChild('routerOutletElement') routerOutletElement: IonRouterOutlet;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
            ev.detail.register(-1, () => {
                if (!this.routerOutletElement.canGoBack()) {
                    App.exitApp();
                }
            });
        });

        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

    }
}
