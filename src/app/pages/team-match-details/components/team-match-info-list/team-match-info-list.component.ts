import {Component, Input} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';

@Component({
    selector: 'beping-team-match-info-list',
    templateUrl: './team-match-info-list.component.html',
    styleUrls: ['./team-match-info-list.component.css']
})
export class TeamMatchInfoListComponent {

    @Input() match: TeamMatchesEntry;


    getDivisionNumber(divShortName: string): string {
        return divShortName.replace(/[a-zA-Z]/g, '');
    }

    getDivisionSerie(divShortName: string): string {
        return divShortName.replace(/[0-9]/g, '');
    }
}
