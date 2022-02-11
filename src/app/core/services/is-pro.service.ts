import {Injectable} from '@angular/core';
import {from, Observable, of} from 'rxjs';
import {Store} from '@ngxs/store';
import {InAppPurchasesState} from '../store/in-app-purchases/in-app-purchases.state';
import {DialogService} from './dialog-service.service';
import {ModalOptions, OverlayEventDetail} from '@ionic/core';
import {PremiumSubscriptionsComponent} from '../../pages/settings/containers/premium-subscriptions/premium-subscriptions.component';
import {map, switchMap} from 'rxjs/operators';
import {ModalController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class IsProService {

    constructor(
        private readonly dialogService: DialogService,
        private readonly modalCtrl: ModalController,
        private readonly store: Store,
    ) {
    }

    isPro$({presentingElement}: { presentingElement?: HTMLElement }): Observable<boolean> {
        const isPro = this.store.selectSnapshot(InAppPurchasesState.isPro);
        if (isPro) {
            // Si déjà Premium
            console.log('isAlreadyPro');
            return of(true);
        }


        return from(this.modalCtrl.getTop()).pipe(
            switchMap((topModal) => {
                console.log('top', topModal);
                const opts: ModalOptions = {
                    component: PremiumSubscriptionsComponent,
                    swipeToClose: !!topModal,
                    presentingElement: topModal,
                    componentProps: {
                        isModal: true
                    }
                };
                return from(this.dialogService.showModal(opts));
            }),
            switchMap((modal: HTMLIonModalElement) => from(modal.onWillDismiss<{ isPro: boolean }>())),
            map((modalResult: OverlayEventDetail<{ isPro: boolean }>) => {
                return modalResult.data.isPro;
            })
        );
    }

}
