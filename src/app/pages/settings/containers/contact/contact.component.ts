import {Component, OnInit} from '@angular/core';
import {EmailComposer} from 'capacitor-email-composer';
import {DialogService} from '../../../../core/services/dialog-service.service';
import {App} from '@capacitor/app';
import {Device} from '@capacitor/device';
import {Store} from '@ngxs/store';
import {environment} from '../../../../../environments/environment';
import {Buffer} from 'buffer';
import {Network} from '@capacitor/network';
import {FirebaseAnalytics} from '@capacitor-firebase/analytics';
import {FirebaseCrashlytics} from '@capacitor-firebase/crashlytics';

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
        const networkInfo = await Network.getStatus();
        const email = environment.bepingContactEmail;
        const completeStore = JSON.parse(JSON.stringify(this.store.selectSnapshot((s) => s)));
        delete completeStore.user.tabt;
        const deviceInfos = `${deviceInfo.manufacturer} ${deviceInfo.model}\n${deviceInfo.operatingSystem} ${deviceInfo.osVersion}\n${deviceInfo.webViewVersion}\n${deviceInfo.name}\nConnected to internet: ${networkInfo.connected}\nConnection type: ${networkInfo.connectionType}`;
        const storeB64 = Buffer.from(JSON.stringify(completeStore), 'utf-8').toString('base64');
        const deviceInfoB64 = Buffer.from(deviceInfos, 'utf-8').toString('base64');
        try {
            const open = await EmailComposer.hasAccount();
            if (open.hasAccount) {
                EmailComposer.open({
                    subject: `Support ${info.name} ${info.version}(${info.build})`,
                    body: ``,
                    to: [email],
                    attachments: [
                        {
                            type: 'base64',
                            path: storeB64,
                            name: 'snapshop-beping.txt'
                        },
                        {
                            type: 'base64',
                            path: deviceInfoB64,
                            name: 'device-infos.txt'
                        }
                    ]
                });
            } else {
                this.dialogService.showErrorAlert({message: 'Aucun compte email configuré. Envoyé un mail à ' + email});
            }
        } catch (e) {
            this.dialogService.showErrorAlert({message: 'Impossible to open an email composer. Please send a mail to ' + email});
        }

    }

}
