import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';

@Component({
    selector: 'beping-team-match-player-list',
    templateUrl: './team-match-player-list.component.html',
    styleUrls: ['./team-match-player-list.component.scss']
})
export class TeamMatchPlayerListComponent implements OnInit {
    @Input() match: TeamMatchesEntry;

    constructor() {
    }

    ngOnInit() {
    }

}
