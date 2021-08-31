import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter, switchMap} from 'rxjs/operators';

import {FirebaseAnalytics} from '@capacitor-community/firebase-analytics';
import {Device} from '@capacitor/device';
import {BehaviorSubject, from} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private analyticsReady = new BehaviorSubject(false);

    constructor(private readonly router: Router) {
    }

    async initFb(): Promise<void> {
        if (this.analyticsReady.value) {
            return;
        }
        const device = await Device.getInfo();
        if (device.platform === 'web') {
            await FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
        }
        this.analyticsReady.next(true);

        this.router.events.pipe(filter((e: RouterEvent) => {
            return e instanceof NavigationEnd;
        })).subscribe(async (event: RouterEvent) => {
            await this.setScreenName(event.url);
        });
    }

    async setUser(userId: string): Promise<void> {
        return this.analyticsReady.pipe(
            filter((ready) => ready),
            switchMap(() => {
                return from(FirebaseAnalytics.setUserId({userId}));
            })
        ).toPromise();
    }

    async setUserProperty(name: string, value: string) {
        return this.analyticsReady.pipe(
            filter((ready) => ready),
            switchMap(() => {
                return from(FirebaseAnalytics.setUserProperty({name, value}));
            })
        ).toPromise();
    }

    logEvent(name: string, params?: object) {
        return this.analyticsReady.pipe(
            filter((ready) => ready),
            switchMap(() => {
                return from(FirebaseAnalytics.logEvent({
                    name,
                    params
                }));
            })
        ).toPromise();
    }

    async setScreenName(screenName: string) {
        return this.analyticsReady.pipe(
            filter((ready) => ready),
            switchMap(() => {
                return from(FirebaseAnalytics.setScreenName({
                    screenName,
                    nameOverride: screenName
                }));
            })
        ).toPromise();
    }

}
