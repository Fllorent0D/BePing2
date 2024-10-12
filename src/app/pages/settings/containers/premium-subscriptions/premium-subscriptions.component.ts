import {Component, Input, OnInit} from '@angular/core';
import {InAppPurchasesState} from '../../../../core/store/in-app-purchases/in-app-purchases.state';
import {combineLatest, Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {InAppPurchasesService} from '../../../../core/services/in-app-purchases.service';
import {InAppPurchaseManageSubscriptions, InAppPurchaseRestore} from '../../../../core/store/in-app-purchases/in-app-purchases.actions';
import {FormControl, Validators} from '@angular/forms';
import {filter, map, startWith} from 'rxjs/operators';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {IonNav, LoadingController, ModalController} from '@ionic/angular';
import {PrivacyComponent} from '../privacy/privacy.component';
import {ConditionsUsageComponent} from '../conditions-usage/conditions-usage.component';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {PurchasesPackage} from '@revenuecat/purchases-typescript-internal-esm/dist/offerings';

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
    priceSlider: FormControl<number>;

    availablePackages$: Observable<PurchasesPackage[]>;
    currentPackage$: Observable<PurchasesPackage>;

    constructor(
        private readonly inAppPurchasesService: InAppPurchasesService,
        private readonly store: Store,
        private readonly dialogService: DialogService,
        private readonly modalCtrl: ModalController,
        private readonly ionNav: IonNav,
        private readonly loadingCtrl: LoadingController,
    ) {
    }

    ngOnInit(): void {
        this.isPro$ = this.store.select(InAppPurchasesState.isPro);
        this.expiryDate$ = this.store.select(InAppPurchasesState.expiryDate);
        this.priceSlider = new FormControl(this.initProduct, [Validators.required]);


        this.currentPackage$ = combineLatest([
            this.priceSlider.valueChanges.pipe(
                startWith(2)
            ),
            this.inAppPurchasesService.availablePackages$
        ]).pipe(
            untilDestroyed(this),
            map(([priceNumber, packages]) => {
                return packages[priceNumber - 1];
            })
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

    async order(aPackage: PurchasesPackage) {
        const loader = await this.loadingCtrl.create({
            message: 'Achat en cours...',
        });
        await loader.present();
        try {
            await this.inAppPurchasesService.order(aPackage);
        } catch (e) {
            console.error('error order', e);
        }

        await loader.dismiss();
    }

    async restore() {
        const loader = await this.dialogService.showToast({
            message: 'Restauration en cours...',
        });
        await loader.present();
        this.store.dispatch(new InAppPurchaseRestore()).subscribe(() => {
            loader.dismiss();
        });
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
