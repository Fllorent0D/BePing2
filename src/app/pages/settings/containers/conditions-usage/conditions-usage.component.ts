import {Component, Input, OnInit, Optional} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ReplaySubject} from 'rxjs';
import {LANG} from 'src/app/core/models/langs';
import {Store} from '@ngxs/store';
import {SettingsState} from '../../../../core/store/settings';

@Component({
    selector: 'beping-conditions-usage',
    templateUrl: './conditions-usage.component.html',
    styleUrls: ['./conditions-usage.component.css']
})
export class ConditionsUsageComponent implements OnInit {
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
