import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {InAppPurchase2} from '@ionic-native/in-app-purchase-2/ngx';
import {
    DismissDashboardProPopup,
    InAppPurchaseManageSubscriptions,
    InAppPurchaseOrder,
    InAppPurchaseRestore,
    IsPro
} from './in-app-purchases.actions';
import {sub} from 'date-fns';
import {environment} from '../../../../environments/environment';

export interface InAppPurchaseStateModel {
    isPro: boolean;
    expiryDate: Date | undefined;
    dashboardPopupDismissedDate: number | undefined;
}

@State<InAppPurchaseStateModel>({
    name: 'inapppurchase',
    defaults: {
        isPro: false,
        expiryDate: null,
        dashboardPopupDismissedDate: null,
    }
})
@Injectable()
export class InAppPurchasesState {

    @Selector([InAppPurchasesState])
    static isPro(state: InAppPurchaseStateModel): boolean {
        return !environment.production || state.isPro;
    }

    @Selector([InAppPurchasesState])
    static expiryDate(state: InAppPurchaseStateModel): Date | undefined {
        return state.expiryDate;
    }

    @Selector([InAppPurchasesState])
    static showBePingProBanner(state: InAppPurchaseStateModel): boolean {
        const timeThreshold = sub(Date.now(), {months: 1});

        return !state.isPro && (!state.dashboardPopupDismissedDate || state.dashboardPopupDismissedDate < timeThreshold.getTime());
    }

    constructor(
        private inAppPurchaseStore: InAppPurchase2
    ) {
    }

    @Action([InAppPurchaseOrder])
    order(_, action: InAppPurchaseOrder) {
        this.inAppPurchaseStore.order(action.productId);
    }

    @Action([DismissDashboardProPopup])
    dismissDashboardPopup(ctx: StateContext<InAppPurchaseStateModel>) {
        return ctx.patchState({
            dashboardPopupDismissedDate: new Date().getTime()
        });
    }

    @Action([IsPro])
    isPro(ctx: StateContext<InAppPurchaseStateModel>, action: IsPro) {
        ctx.patchState({isPro: action.isPro, expiryDate: action.expiryDate});
    }

    @Action([InAppPurchaseManageSubscriptions])
    manageSubscription() {
        this.inAppPurchaseStore.manageSubscriptions();
    }

    @Action([InAppPurchaseRestore])
    restore() {
        this.inAppPurchaseStore.refresh();
    }


}
