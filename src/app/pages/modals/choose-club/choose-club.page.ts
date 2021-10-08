import {Component, OnInit} from '@angular/core';
import {ClubEntry} from '../../../core/api/models/club-entry';
import {ModalController} from '@ionic/angular';
import {ClubsState} from '../../../core/store/clubs';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';

import {Capacitor} from '@capacitor/core';

import {Keyboard} from '@capacitor/keyboard';

@Component({
    selector: 'beping-choose-club',
    templateUrl: './choose-club.page.html',
    styleUrls: ['./choose-club.page.scss']
})
export class ChooseClubPage implements OnInit {

    searchBox: FormControl;
    clubsFound$: Observable<ClubEntry[]>;
    terms$: Observable<string>;

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly store: Store
    ) {
        this.searchBox = new FormControl();
    }


    ngOnInit() {
        this.terms$ = this.clubsFound$ = this.searchBox.valueChanges.pipe(
            distinctUntilChanged(),
            startWith('')
        );

        this.clubsFound$ = this.terms$.pipe(
            switchMap((terms) => this.store.select(ClubsState.searchClub(terms)))
        );
    }

    async clubClicked(club: ClubEntry) {
        await this.hideKeyboard();
        await this.modalCtrl.dismiss({club});
    }

    async closeModal() {
        await this.modalCtrl.dismiss();
    }

    searchClicked() {
        this.hideKeyboard();
    }

    categoryHeader(record: ClubEntry, recordIndex: number, records: ClubEntry[]) {
        const previous = records[recordIndex - 1];

        if (!previous || (previous.CategoryName !== record.CategoryName)) {
            return record.CategoryName;
        }

        return null;
    }

    private async hideKeyboard() {
        if (Capacitor.getPlatform() !== 'web') {
            await Keyboard.hide();
        }
    }
}
