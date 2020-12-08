import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import '@capacitor-community/firebase-analytics';
import {Plugins} from '@capacitor/core';

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
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            // @ts-ignore
            FirebaseAnalytics.initializeFirebase({
                apiKey: 'AIzaSyCyRbWj4JqPsD9WXzXInNciAy_lyyy82ks',
                authDomain: 'beping2-bae71.firebaseapp.com',
                projectId: 'beping2-bae71',
                storageBucket: 'beping2-bae71.appspot.com',
                messagingSenderId: '155549718272',
                appId: '1:155549718272:web:aa6ed6123085ac0f8185e5',
                measurementId: 'G-W9YM6QPM4G'
            });
            FirebaseAnalytics.setUserId({
                userId: 'florent_cardoen_123'
            });
        });
    }
}
