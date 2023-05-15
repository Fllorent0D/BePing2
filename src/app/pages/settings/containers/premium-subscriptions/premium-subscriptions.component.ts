import {Component, Input, OnInit} from '@angular/core';
import {InAppPurchasesState} from '../../../../core/store/in-app-purchases/in-app-purchases.state';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {InAppPurchasesService} from '../../../../core/services/in-app-purchases.service';
import {IAPProduct} from '@ionic-native/in-app-purchase-2';
import {
    InAppPurchaseManageSubscriptions,
    InAppPurchaseOrder,
    InAppPurchaseRestore
} from '../../../../core/store/in-app-purchases/in-app-purchases.actions';
import {BePingIAP} from '../../../../core/store/in-app-purchases/in-app-purchases.model';
import {FormControl, Validators} from '@angular/forms';
import {filter, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {IonNav, ModalController} from '@ionic/angular';
import {PrivacyComponent} from '../privacy/privacy.component';
import {ConditionsUsageComponent} from '../conditions-usage/conditions-usage.component';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'beping-premium-subscriptions',
    templateUrl: './premium-subscriptions.component.html',
    styleUrls: ['./premium-subscriptions.component.css']
})
export class PremiumSubscriptionsComponent implements OnInit {

    @Input() isModal = false;

    isPro$: Observable<boolean>;
    expiryDate$: Observable<Date | undefined>;
    initProduct = 2;
    bepingProLowPrice$: Observable<IAPProduct>;
    bepingProMidPrice$: Observable<IAPProduct>;
    bepingProHighPrice$: Observable<IAPProduct>;
    currentProduct$: Observable<IAPProduct>;
    priceSlider: FormControl<number>;

    constructor(
        private readonly inAppPurchasesService: InAppPurchasesService,
        private readonly store: Store,
        private readonly dialogService: DialogService,
        private readonly modalCtrl: ModalController,
        private readonly ionNav: IonNav,
    ) {
    }

    ngOnInit(): void {
        this.isPro$ = this.store.select(InAppPurchasesState.isPro);
        this.expiryDate$ = this.store.select(InAppPurchasesState.expiryDate);
        this.priceSlider = new FormControl(this.initProduct, [Validators.required]);
        this.bepingProLowPrice$ = this.inAppPurchasesService.iapPurchase(BePingIAP.BEPING_PRO_LOW_PRICE);
        this.bepingProMidPrice$ = this.inAppPurchasesService.iapPurchase(BePingIAP.BEPING_PRO_MID_PRICE);
        this.bepingProHighPrice$ = this.inAppPurchasesService.iapPurchase(BePingIAP.BEPING_PRO_HIGH_PRICE);
        this.currentProduct$ = this.priceSlider.valueChanges.pipe(
            startWith(this.initProduct),
            switchMap((priceNumber) => {
                if (priceNumber === 1) {
                    return this.bepingProLowPrice$;
                } else if (priceNumber === 2) {
                    return this.bepingProMidPrice$;
                } else {
                    return this.bepingProHighPrice$;
                }
            }),
            shareReplay(1)
        );
        if (this.isModal) {
            this.store.select(InAppPurchasesState.isPro).pipe(
                untilDestroyed(this),
                filter((isPro: boolean) => !!isPro)
            ).subscribe(() => {
                this.closeModal(true);
            });
        }
    }

    manageSubscription() {
        this.store.dispatch(new InAppPurchaseManageSubscriptions());
    }

    order() {
        switch (this.priceSlider.value) {
            case 1:
            default:
                this.store.dispatch(new InAppPurchaseOrder(BePingIAP.BEPING_PRO_LOW_PRICE));
                break;
            case 2:
                this.store.dispatch(new InAppPurchaseOrder(BePingIAP.BEPING_PRO_MID_PRICE));
                break;
            case 3:
                this.store.dispatch(new InAppPurchaseOrder(BePingIAP.BEPING_PRO_HIGH_PRICE));
                break;
        }
    }

    restore() {
        this.store.dispatch(new InAppPurchaseRestore());
    }

    closeModal(isPro = false) {
        this.modalCtrl?.dismiss({isPro});
    }

    goToTermsOfUse() {
        this.ionNav?.push(ConditionsUsageComponent);
    }

    goToPrivacy() {
        this.ionNav?.push(PrivacyComponent);
    }
}
