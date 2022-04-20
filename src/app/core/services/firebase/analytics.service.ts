import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter, switchMap} from 'rxjs/operators';

import {FirebaseAnalytics} from '@capacitor-community/firebase-analytics';
import {Device} from '@capacitor/device';
import {BehaviorSubject, from} from 'rxjs';
import {Store} from '@ngxs/store';
import {InAppPurchasesState} from '../../store/in-app-purchases/in-app-purchases.state';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private analyticsReady = new BehaviorSubject(false);

    constructor(
        private readonly router: Router,
        private readonly store: Store
    ) {
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

        this.router.events.pipe(
            filter((e: RouterEvent) => e instanceof NavigationEnd))
            .subscribe(async (event: RouterEvent) => {
                    await this.setScreenName(event.url);
                }
            );
        this.store.select(InAppPurchasesState.isPro)
            .subscribe((isPro) => {
                this.setUserProperty('isPro', `${isPro}`);
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
