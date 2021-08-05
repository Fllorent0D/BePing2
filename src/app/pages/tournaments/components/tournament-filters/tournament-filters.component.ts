import {Component, Input, OnInit} from '@angular/core';
import {TournamentsFilter} from '../../containers/tournaments-page/tournaments-page.component';
import {FormControl, FormGroup} from '@angular/forms';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'beping-tournament-filters',
    templateUrl: './tournament-filters.component.html',
    styleUrls: ['./tournament-filters.component.scss']
})
export class TournamentFiltersComponent implements OnInit {

    @Input() filter: TournamentsFilter;

    formGroup: FormGroup;

    constructor(
        private readonly popoverController: PopoverController
    ) {
    }

    ngOnInit() {
        this.formGroup = new FormGroup({
            levelsToDisplay: new FormControl(this.filter?.levelsToDisplay),
            showPastTournaments: new FormControl(this.filter?.showPastTournaments)
        });
    }

    submit() {
        this.popoverController.dismiss({
            levelsToDisplay: this.formGroup.get('levelsToDisplay').value,
            showPastTournaments: this.formGroup.get('showPastTournaments').value
        } as TournamentsFilter);
    }

}
