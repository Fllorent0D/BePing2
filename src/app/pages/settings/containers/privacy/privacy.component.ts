import {Component, Input, OnInit, Optional} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LANG} from '../../../../core/models/langs';
import {SettingsState} from '../../../../core/store/settings';
import {Store} from '@ngxs/store';
import {ReplaySubject} from 'rxjs';

@Component({
    selector: 'beping-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

    @Input() isModal = false;
    lang$: ReplaySubject<LANG> = new ReplaySubject<LANG>(1);

    LANG = LANG;

    constructor(
        private readonly store: Store,
        @Optional() private readonly modalCtrl: ModalController
    ) {
    }

    ngOnInit(): void {
        this.lang$.next(this.store.selectSnapshot(SettingsState.getCurrentLang));
    }

    async closeModal() {
        await this.modalCtrl.dismiss();
    }

    segmentChanged(lang: CustomEvent) {
        this.lang$.next(lang.detail.value);
    }

}
