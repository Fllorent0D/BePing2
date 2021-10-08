import {Component, OnInit} from '@angular/core';
import {EmailComposer} from 'capacitor-email-composer';
import {DialogService} from '../../../../shared/services/dialog-service.service';

@Component({
    selector: 'beping-contact',
    templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

    constructor(
        private readonly dialogService: DialogService
    ) {
    }

    ngOnInit(): void {
    }

    async sendEmail() {
        try {
            const open = await EmailComposer.hasAccount();
            if (open.hasAccount) {
                EmailComposer.open({
                    subject: 'Contact BePing',
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
