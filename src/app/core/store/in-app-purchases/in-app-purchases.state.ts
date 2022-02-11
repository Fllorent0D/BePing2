import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {InAppPurchase2} from '@ionic-native/in-app-purchase-2/ngx';
import {InAppPurchaseManageSubscriptions, InAppPurchaseOrder, InAppPurchaseRestore, IsPro} from './in-app-purchases.actions';

export interface InAppPurchaseStateModel {
    isPro: boolean;
    expiryDate: Date | undefined;
}

@State<InAppPurchaseStateModel>({
    name: 'inapppurchase',
    defaults: {
        isPro: false,
        expiryDate: null
    }
})
@Injectable()
export class InAppPurchasesState  {

    @Selector([InAppPurchasesState])
    static isPro(state: InAppPurchaseStateModel): boolean {
        return state.isPro;
    }

    @Selector([InAppPurchasesState])
    static expiryDate(state: InAppPurchaseStateModel): Date | undefined {
        return state.expiryDate;
    }

    constructor(
        private inAppPurchaseStore: InAppPurchase2
    ) {
    }

    @Action([InAppPurchaseOrder])
    order(_, action: InAppPurchaseOrder) {
        this.inAppPurchaseStore.order(action.productId);
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
