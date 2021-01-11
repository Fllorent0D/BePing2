import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'beping-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

    @Input() isModal = false;

    constructor(
        private readonly modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
    }

    async closeModal() {
        console.log(this.modalCtrl);
        await this.modalCtrl.dismiss();
    }

}
