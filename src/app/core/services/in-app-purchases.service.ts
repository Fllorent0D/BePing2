import {Injectable} from '@angular/core';
import {Platform, ToastController} from '@ionic/angular';
import {Store} from '@ngxs/store';
import {from, Observable, ReplaySubject} from 'rxjs';
import {catchError, filter, map, switchMap} from 'rxjs/operators';
import {AnalyticsService} from './firebase/analytics.service';
import {CrashlyticsService} from './crashlytics.service';
import {TranslateService} from '@ngx-translate/core';
import {CustomerInfo, LOG_LEVEL, Purchases, PURCHASES_ERROR_CODE} from '@revenuecat/purchases-capacitor';
import {Capacitor} from '@capacitor/core';
import {TabTState} from '../store/user/tabt.state';
import {InAppPurchasesState} from '../store/in-app-purchases/in-app-purchases.state';
import {IsPro, MigratedToRevenueCat, UpdateExpiryDate} from '../store/in-app-purchases/in-app-purchases.actions';
import {PurchasesPackage} from '@revenuecat/purchases-typescript-internal-esm/dist/offerings';
import {FirebaseAnalytics} from '@capacitor-firebase/analytics';
import {UserState} from '../store/user/user.state';
import {ClubEntry} from '../api/models/club-entry';
import {FCM} from '@capacitor-community/fcm';

@Injectable({
    providedIn: 'root'
})
export class InAppPurchasesService {

    private _availablePackages$: ReplaySubject<PurchasesPackage[]>;

    constructor(
        private readonly platform: Platform,
        private readonly store: Store,
        private readonly crashlytics: CrashlyticsService,
        private readonly toastController: ToastController,
        private readonly translateService: TranslateService,
        private readonly analyticsService: AnalyticsService,
    ) {
        this._availablePackages$ = new ReplaySubject<PurchasesPackage[]>(1);
    }

    get availablePackages$(): Observable<PurchasesPackage[]> {
        return this._availablePackages$.asObservable();
    }

    async init(): Promise<void> {
        await this.platform.ready();
        await Purchases.setLogLevel({level: LOG_LEVEL.DEBUG}); // Enable to get debug logs
        if (Capacitor.getPlatform() === 'ios') {
            await Purchases.configure({apiKey: 'appl_dhIBabXrbFtIAKznXAUhjVneKBN'});
        } else if (Capacitor.getPlatform() === 'android') {
            await Purchases.configure({apiKey: 'goog_FhwYrNHVptesbvhWMlFJeBklHcm'});
        }
        await this.setupAttributes();
        await this.syncPurchases();
        await this.fetchOfferings();
        await this.listenCustomerInfo();

        const {customerInfo} = await Purchases.getCustomerInfo();
        this.checkActiveSubscriptions(customerInfo);
    }

    private async fetchOfferings(): Promise<void> {
        try {
            const offerings = await Purchases.getOfferings();
            const currentOffering = offerings.current;
            console.log('[RevenueCat] Offerings', offerings);
            this._availablePackages$.next(currentOffering.availablePackages);
        } catch (e) {
            await this.crashlytics.recordException(e);
        }

    }

    private async syncPurchases(): Promise<void> {
        try {
            if (!this.store.selectSnapshot(InAppPurchasesState.migratedToRevenueCat)) {
                await Purchases.syncPurchases();
                this.store.dispatch(new MigratedToRevenueCat());
                this.analyticsService.logEvent('iap_migrated_to_revenuecat');
            }
        } catch (e) {
            await this.crashlytics.recordException(e);
        }

    }

    private async setupAttributes() {
        try {
            this.store.select(TabTState.account).pipe(
                filter((account) => !!account),
                switchMap((account) => from(Purchases.logIn({appUserID: account})))
            ).subscribe((account) => {
                console.log('[RevenueCat] Logged in with account', account);
            });

            this.store.select(UserState.getPlayerName).pipe(
                map((playerName) => playerName ?? ''),
                switchMap((playerName) =>
                    from(Purchases.setDisplayName({displayName: playerName}))
                        .pipe(map(() => playerName))),
                catchError((error) => {
                        this.crashlytics.recordException(error);
                        return '';
                    }
                )).subscribe((playerName) => {
                console.log('[RevenueCat] Set displayName', playerName);
            });

            this.store.select(UserState.getPlayerUniqueIndex).pipe(
                map((playerUniqueIndex) => playerUniqueIndex?.toString(10) ?? ''),
                switchMap((playerUniqueIndex) =>
                    // @ts-ignore
                    from(Purchases.setAttributes({attributes: {'MemberUniqueIndex': playerUniqueIndex}}))
                        .pipe(map(() => playerUniqueIndex))),
                catchError((error) => {
                    console.log('[RevenueCat] Error setting playerUniqueIndex', error);
                    this.crashlytics.recordException(error);
                    return '';
                })
            ).subscribe((playerUniqueIndex) => {

                console.log('[RevenueCat] Set playerUniqueIndex', playerUniqueIndex);
            });

            this.store.select(UserState.getMemberClub).pipe(
                map((memberClub?: ClubEntry) => memberClub?.UniqueIndex ?? ''),
                // @ts-ignore
                switchMap((uniqueIndex: string) => from(Purchases.setAttributes({attributes: {'ClubUniqueIndex': uniqueIndex}})).pipe(
                    map(() => uniqueIndex)
                )),
                catchError((error) => {
                    this.crashlytics.recordException(error);
                    console.log('[RevenueCat] Error setting clubUniqueIndex', error);
                    return '';
                })
            ).subscribe((attributes) => {
                console.log('[RevenueCat] Set clubUniqueIndex attributes', attributes);
            });
            try {
                const firebaseInstanceId = await FirebaseAnalytics.getAppInstanceId();
                await Purchases.setFirebaseAppInstanceID({firebaseAppInstanceID: firebaseInstanceId?.appInstanceId});
            } catch (e) {
                await this.crashlytics.recordException(e);
            }

            try {
                const token = await FCM.getToken();
                await Purchases.setPushToken({pushToken: token.token});
            } catch (e) {
                await Purchases.setPushToken({pushToken: null});
                await this.crashlytics.recordException(e);
            }

        } catch (error) {
            await this.crashlytics.recordException(error);
        }

    }

    async order(purchasesPackage: PurchasesPackage): Promise<void> {
        try {
            await Purchases.purchasePackage({
                aPackage: purchasesPackage
            });

        } catch (error) {
            if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
                const toast = await this.toastController.create({
                    message: 'The purchase was cancelled',
                    duration: 2000
                });
                await toast.present();
            } else {
                const toast = await this.toastController.create({
                    message: 'An error occurred while processing the purchase',
                    duration: 2000
                });
                await toast.present();
            }
        }

    }

    private checkActiveSubscriptions(customerInfo: CustomerInfo): void {
        const activeSubscriptions = customerInfo.activeSubscriptions;
        if (activeSubscriptions.length > 0) {
            const expiryDate = customerInfo.allExpirationDates[activeSubscriptions[0]];
            this.store.dispatch(new UpdateExpiryDate(new Date(expiryDate)));
            this.store.dispatch(new IsPro(true));
        } else {
            this.store.dispatch(new IsPro(false));
        }
    }

    private async listenCustomerInfo(): Promise<void> {
        await Purchases.addCustomerInfoUpdateListener(this.checkActiveSubscriptions.bind(this));
    }
}
