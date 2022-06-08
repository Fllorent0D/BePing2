import {Component, Input, OnInit} from '@angular/core';
import {TournamentsFilter} from '../../containers/tournaments-page/tournaments-page.component';
import {FormControl, FormGroup} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {Level} from 'src/app/core/models/level';

@Component({
    selector: 'beping-tournament-filters',
    templateUrl: './tournament-filters.component.html',
    styleUrls: ['./tournament-filters.component.scss']
})
export class TournamentFiltersComponent implements OnInit {

    @Input() filter: TournamentsFilter;
    levels = Object.values(Level);
    formGroup: FormGroup;

    constructor(
        private readonly modalCtrl: ModalController
    ) {
    }

    ngOnInit() {
        this.formGroup = new FormGroup({
            levelsToDisplay: new FormControl<string[]>(this.filter?.levelsToDisplay),
            showPastTournaments: new FormControl<boolean>(this.filter?.showPastTournaments)
        });
    }

    submit() {
        this.modalCtrl.dismiss({
            levelsToDisplay: this.formGroup.get('levelsToDisplay').value,
            showPastTournaments: this.formGroup.get('showPastTournaments').value
        } as TournamentsFilter);
    }

    cancel() {
        this.modalCtrl.dismiss();
    }
}
