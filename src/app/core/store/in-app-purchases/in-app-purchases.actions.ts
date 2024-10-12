import {BePingIAP} from './in-app-purchases.model';

export class InAppPurchaseOrder {
    static readonly type = '[IAP] Order';

    constructor(public productId: BePingIAP) {
    }

}

export class InAppPurchaseRestore {
    static readonly type = '[IAP] Restore';

    constructor() {
    }

}

export class InAppPurchaseManageSubscriptions {
    static readonly type = '[IAP] Manage subscription';
}

export class IsPro {
    static readonly type = '[IAP] ProductStatusUpdate';

    constructor(
        public isPro: boolean,
    ) {
    }

}
export class UpdateExpiryDate {
    static readonly type = '[IAP] Update expiry date';

    constructor(
        public expiryDate: Date,
    ) {
    }

}

export class SetStoreReady {
    static readonly type = '[IAP] Set store readiness';

    constructor(public ready: boolean) {
    }
}

export class DismissDashboardProPopup {
    static readonly type = '[IAP] dismiss the popup';

    constructor() {
    }
}

export class MigratedToRevenueCat {
    static readonly type = '[IAP] Migrate to RevenueCat';

    constructor() {
    }
}
