import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';

@Component({
    selector: 'beping-team-match-player-list',
    templateUrl: './team-match-player-list.component.html',
    styleUrls: ['./team-match-player-list.component.scss']
})
export class TeamMatchPlayerListComponent implements OnInit {
    @Input() match: TeamMatchesEntry;
    @Output() playerClicked: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
    }

}
