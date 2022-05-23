import {ChangeDetectorRef, Injectable} from '@angular/core';
import {Platform, ToastController} from '@ionic/angular';
import {IAPProduct, InAppPurchase2} from '@ionic-native/in-app-purchase-2/ngx';
import {BePingIAP} from '../store/in-app-purchases/in-app-purchases.model';
import {StateContext, Store} from '@ngxs/store';
import {InAppPurchasesState} from '../store/in-app-purchases/in-app-purchases.state';
import {Observable, ReplaySubject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AnalyticsService} from './firebase/analytics.service';
import {IsPro} from '../store/in-app-purchases/in-app-purchases.actions';
import {CrashlyticsService} from './crashlytics.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InAppPurchasesService {

    private productsSubject$: ReplaySubject<IAPProduct[]>;
    public products$: Observable<IAPProduct[]>;

    constructor(
        private readonly platform: Platform,
        private readonly inAppPurchaseStore: InAppPurchase2,
        private readonly store: Store,
        private readonly crashlytics: CrashlyticsService,
        private readonly toastController: ToastController,
        private readonly translateService: TranslateService,
        private readonly analyticsService: AnalyticsService,
    ) {
        this.productsSubject$ = new ReplaySubject<IAPProduct[]>(1);
        this.products$ = this.productsSubject$.asObservable();
    }

    iapPurchase(iap: BePingIAP): Observable<IAPProduct> {
        return this.products$.pipe(
            tap((p) => console.log('products', p)),
            map((products: IAPProduct[]) => products.find(product => product?.id === iap)),
        );
    }

    async init(): Promise<void> {
        await this.platform.ready();
        this.inAppPurchaseStore.verbosity = environment.production ?  this.inAppPurchaseStore.DEBUG : this.inAppPurchaseStore.INFO;
        this.setupListeners();
        this.registerProduct();
        this.inAppPurchaseStore?.refresh();
        this.inAppPurchaseStore?.ready(() => {
            //this.productsSubject$.next(this.inAppPurchaseStore.products);
        });
    }

    private registerProduct() {
        this.inAppPurchaseStore.register([{
            id: BePingIAP.BEPING_PRO_LOW_PRICE,
            type: this.inAppPurchaseStore.PAID_SUBSCRIPTION
        }, {
            id: BePingIAP.BEPING_PRO_MID_PRICE,
            type: this.inAppPurchaseStore.PAID_SUBSCRIPTION
        }, {
            id: BePingIAP.BEPING_PRO_HIGH_PRICE,
            type: this.inAppPurchaseStore.PAID_SUBSCRIPTION
        }]);
    }

    private setupListeners(ctx?: StateContext<InAppPurchasesState>) {
        this.inAppPurchaseStore.error((err) => {
            this.crashlytics.recordException({message: err.message, domain: 'in-app-purchase'});
            this.toastController.create({
                message: this.translateService.instant('ERROR_TABT.INTERNAL'),
                duration: 3000,
                color: 'danger'
            });
        });
        this.inAppPurchaseStore.when('subscription').updated((a) => {
            const product1 = this.inAppPurchaseStore.get(BePingIAP.BEPING_PRO_LOW_PRICE);
            const product2 = this.inAppPurchaseStore.get(BePingIAP.BEPING_PRO_MID_PRICE);
            const product3 = this.inAppPurchaseStore.get(BePingIAP.BEPING_PRO_HIGH_PRICE);
            const products = [product1, product2, product3];
            this.productsSubject$.next(products);

            if (products.some(product => product?.owned)) {
                this.store.dispatch(new IsPro(true, products.find(product => product?.owned)?.expiryDate));
            } else {
                this.store.dispatch(new IsPro(false, undefined));
            }
        });


        this.inAppPurchaseStore
            .when('product')
            .approved((product: IAPProduct) => product.verify())
            .verified((product: IAPProduct) => product.finish());
    }
}
