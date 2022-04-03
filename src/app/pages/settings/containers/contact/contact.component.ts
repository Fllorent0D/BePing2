import {Component, OnInit} from '@angular/core';
import {EmailComposer} from 'capacitor-email-composer';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {App} from '@capacitor/app';
import {Device} from '@capacitor/device';
import {Store} from '@ngxs/store';

@Component({
    selector: 'beping-contact',
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

    constructor(
        private readonly dialogService: DialogService,
        private readonly store: Store
    ) {
    }

    ngOnInit(): void {
    }

    async sendEmail() {
        const info = await App.getInfo();
        const deviceInfo = await Device.getInfo();
        const id = 1;
        const completeStore = JSON.parse(JSON.stringify(this.store.selectSnapshot((s) => s)));
        delete completeStore.user.tabt;
        delete completeStore.divisions;
        delete completeStore.clubs;
        const storeB64 = btoa(JSON.stringify(completeStore));
        try {
            const open = await EmailComposer.hasAccount();
            if (open.hasAccount) {
                EmailComposer.open({
                    subject: `Support ${info.name} ${info.version}(${info.build})`,
                    body: `\n\n\n\n\n---- Ne pas retirer ----  Niet terugtrekken  ----  Do not remove ----------\n${deviceInfo.manufacturer} ${deviceInfo.model} - ${deviceInfo.operatingSystem} ${deviceInfo.osVersion} - ${deviceInfo.webViewVersion}\n\n\n ---- Ceci contient l'état actuel de l'application ---- Dit bevat de huidige status van de app ---- This contains current state of the app ---- \n\n${storeB64}`,
                    to: ['f.cardoen@me.com']
                });
            } else {
                this.dialogService.showErrorAlert({message: 'Aucun compte email configuré. Envoyé un mail à f.cardoen@me.com'});
            }
        } catch (e) {
            this.dialogService.showErrorAlert({message: 'Impossible to open an email composer. Please send a mail to f.cardoen@me.com'});
        }

    }

}
