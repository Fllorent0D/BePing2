import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {TeamPlayersStats} from '../../model/team-players-stats.model';
import {MemberEntry} from '../../../../core/api/models/member-entry';

@Component({
    selector: 'beping-team-players-stats',
    templateUrl: './team-players-stats.component.html',
    styleUrls: ['./team-players-stats.component.scss']
})
export class TeamPlayersStatsComponent implements OnInit {

    @Input() stats: TeamPlayersStats = [];

    @Output() playerClicked: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
        console.log(this.stats);
    }

}
