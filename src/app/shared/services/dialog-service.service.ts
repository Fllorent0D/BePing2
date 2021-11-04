import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ModalController, PopoverController, ToastController} from '@ionic/angular';
import {AlertOptions, LoadingOptions, ModalOptions, PopoverOptions} from '@ionic/core';
import {ToastOptions} from '@ionic/core/dist/types/components/toast/toast-interface';

@Injectable()
export class DialogService {
    constructor(
        private alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private popoverCtrl: PopoverController,
        private toastrCtrl: ToastController
    ) {
    }

    public async showAlert(opts?: AlertOptions): Promise<HTMLIonAlertElement> {
        const alert = await this.alertCtrl.create(opts);
        await alert.present();
        return alert;
    }

    public async showErrorAlert(
        opts?: AlertOptions
    ): Promise<HTMLIonAlertElement> {
        const defaultOpts: AlertOptions = {
            header: 'Error',
            buttons: ['OK']
        };
        opts = {...defaultOpts, ...opts};
        return this.showAlert(opts);
    }

    public async showModal(opts: ModalOptions): Promise<HTMLIonModalElement> {
        const modal = await this.modalCtrl.create(opts);
        await modal.present();
        return modal;
    }

    public async showPopover(
        opts: PopoverOptions
    ): Promise<HTMLIonPopoverElement> {
        const popover = await this.popoverCtrl.create(opts);
        await popover.present();
        return popover;
    }

    public async showToast(
        opts: ToastOptions
    ): Promise<HTMLIonToastElement> {
        const toast = await this.toastrCtrl.create({...opts});
        await toast.present();
        return toast;
    }

    public async showLoading(
        opts?: LoadingOptions
    ): Promise<HTMLIonLoadingElement> {
        const defaultOpts: LoadingOptions = {
            message: 'Please wait...'
        };
        opts = {...defaultOpts, ...opts};
        const loading = await this.loadingCtrl.create(opts);
        await loading.present();
        return loading;
    }
}
