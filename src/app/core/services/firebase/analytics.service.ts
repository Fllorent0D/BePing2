import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

import {FirebaseAnalytics} from '@capacitor-community/firebase-analytics';
import {Device} from '@capacitor/device';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    constructor(private readonly router: Router) {
        this.initFb();
        this.router.events.pipe(filter((e: RouterEvent) => {
            return e instanceof NavigationEnd;
        })).subscribe((event: RouterEvent) => {
            this.setScreenName(event.url);
        });
    }

    async initFb() {
        if ((await Device.getInfo()).platform === 'web') {
            await FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
        }
    }

    setUser(userId: string) {
        FirebaseAnalytics.setUserId({
            userId
        });
    }

    logEvent(name: string, params: object) {
        FirebaseAnalytics.logEvent({
            name,
            params
        });
    }

    setScreenName(screenName: string) {
        FirebaseAnalytics.setScreenName({
            screenName
        });
    }

}
