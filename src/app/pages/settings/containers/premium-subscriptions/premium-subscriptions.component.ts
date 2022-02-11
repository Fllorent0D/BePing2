import {Component, Input, OnInit} from '@angular/core';
import {InAppPurchasesState} from '../../../../core/store/in-app-purchases/in-app-purchases.state';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {InAppPurchasesService} from '../../../../core/services/in-app-purchases.service';
import {IAPProduct} from '@ionic-native/in-app-purchase-2';
import {
    InAppPurchaseManageSubscriptions,
    InAppPurchaseOrder,
    InAppPurchaseRestore
} from '../../../../core/store/in-app-purchases/in-app-purchases.actions';
import {BePingIAP} from '../../../../core/store/in-app-purchases/in-app-purchases.model';
import {FormControl, Validators} from '@angular/forms';
import {filter, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {OnDestroyHook} from '../../../../core/on-destroy-hook';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'beping-premium-subscriptions',
    templateUrl: './premium-subscriptions.component.html',
    styleUrls: ['./premium-subscriptions.component.css']
})
export class PremiumSubscriptionsComponent extends OnDestroyHook implements OnInit {

    @Input() isModal = false;

    @Select(InAppPurchasesState.isPro) isPro$: Observable<boolean>;
    @Select(InAppPurchasesState.expiryDate) expiryDate$: Observable<Date | undefined>;
    productNumber = 1;
    bepingProLowPrice$: Observable<IAPProduct>;
    bepingProMidPrice$: Observable<IAPProduct>;
    bepingProHighPrice$: Observable<IAPProduct>;
    currentProduct$: Observable<IAPProduct>;
    priceSlider: FormControl;

    constructor(
        private readonly inAppPurchasesService: InAppPurchasesService,
        private readonly store: Store,
        private readonly dialogService: DialogService,
        private readonly modalCtrl: ModalController
    ) {
        super();
    }

    ngOnInit(): void {
        this.priceSlider = new FormControl(1, [Validators.required]);
        this.bepingProLowPrice$ = this.inAppPurchasesService.iapPurchase(BePingIAP.BEPING_PRO_LOW_PRICE);
        this.bepingProMidPrice$ = this.inAppPurchasesService.iapPurchase(BePingIAP.BEPING_PRO_MID_PRICE);
        this.bepingProHighPrice$ = this.inAppPurchasesService.iapPurchase(BePingIAP.BEPING_PRO_HIGH_PRICE);
        this.currentProduct$ = this.priceSlider.valueChanges.pipe(
            startWith(1),
            switchMap((priceNumber) => {
                if (priceNumber === 1) {
                    return this.bepingProLowPrice$;
                } else if (priceNumber === 2) {
                    return this.bepingProMidPrice$;
                } else {
                    return this.bepingProHighPrice$;
                }
            }),
        );
        if (this.isModal) {
            this.store.select(InAppPurchasesState.isPro).pipe(
                takeUntil(this.ngUnsubscribe),
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
        this.store.dispatch(new InAppPurchaseOrder(BePingIAP.BEPING_PRO_LOW_PRICE));
    }

    restore() {
        this.store.dispatch(new InAppPurchaseRestore());
    }

    closeModal(isPro = false) {
        this.modalCtrl?.dismiss({isPro});
    }
}
