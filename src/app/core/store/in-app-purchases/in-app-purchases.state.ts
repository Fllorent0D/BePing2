import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
    DismissDashboardProPopup,
    InAppPurchaseManageSubscriptions,
    InAppPurchaseOrder,
    InAppPurchaseRestore,
    IsPro,
    MigratedToRevenueCat,
    UpdateExpiryDate
} from './in-app-purchases.actions';
import {sub} from 'date-fns';
import {Platform} from '@ionic/angular';
import {from} from 'rxjs';
import {Purchases} from '@revenuecat/purchases-capacitor';
import {AppLauncher} from '@capacitor/app-launcher';

export interface InAppPurchaseStateModel {
    isPro: boolean;
    expiryDate: Date | undefined;
    dashboardPopupDismissedDate: number | undefined;
    migratedToRevenueCat: boolean;
}

@State<InAppPurchaseStateModel>({
    name: 'inapppurchase',
    defaults: {
        isPro: false,
        expiryDate: null,
        dashboardPopupDismissedDate: null,
        migratedToRevenueCat: false
    }
})
@Injectable()
export class InAppPurchasesState {


    @Selector([InAppPurchasesState])
    static isPro(state: InAppPurchaseStateModel): boolean {
        return state.isPro;
    }

    @Selector([InAppPurchasesState])
    static expiryDate(state: InAppPurchaseStateModel): Date | undefined {
        return state.expiryDate;
    }

    @Selector([InAppPurchasesState])
    static migratedToRevenueCat(state: InAppPurchaseStateModel): boolean {
        return state.migratedToRevenueCat;
    }

    @Selector([InAppPurchasesState])
    static showBePingProBanner(state: InAppPurchaseStateModel): boolean {
        const timeThreshold = sub(Date.now(), {months: 1});

        return !state.isPro && (!state.dashboardPopupDismissedDate || state.dashboardPopupDismissedDate < timeThreshold.getTime());
    }

    constructor(
        private readonly platform: Platform,
    ) {
    }

    @Action([DismissDashboardProPopup])
    dismissDashboardPopup(ctx: StateContext<InAppPurchaseStateModel>) {
        return ctx.patchState({
            dashboardPopupDismissedDate: new Date().getTime()
        });
    }

    @Action([IsPro])
    isPro(ctx: StateContext<InAppPurchaseStateModel>, action: IsPro) {
        console.log('STORE setting isPro to ' + action.isPro);
        ctx.patchState({isPro: action.isPro});
    }

    @Action([UpdateExpiryDate])
    updateExpiryDate(ctx: StateContext<InAppPurchaseStateModel>, action: UpdateExpiryDate) {
        ctx.patchState({expiryDate: action.expiryDate});
    }

    @Action([InAppPurchaseManageSubscriptions])
    async manageSubscription() {
        if (this.platform.is('ios')) {
            await AppLauncher.openUrl({url: 'https://apps.apple.com/account/subscriptions'});
        } else if (this.platform.is('android')) {
            await AppLauncher.openUrl({url: 'https://play.google.com/store/account/subscriptions'});
        }

    }

    @Action([InAppPurchaseRestore])
    restore() {
        return from(Purchases.restorePurchases());
    }

    @Action([MigratedToRevenueCat])
    migrateToRevenueCat(ctx: StateContext<InAppPurchaseStateModel>) {
        ctx.patchState({migratedToRevenueCat: true});
    }


}
