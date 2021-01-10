import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../../../core/api/models/team-matches-entry';
import {Player} from '../../../../../core/api/models/player';

@Component({
    selector: 'beping-team-match-player-item',
    templateUrl: './team-match-player-item.component.html',
    styleUrls: ['./team-match-player-item.component.scss']
})
export class TeamMatchPlayerItemComponent implements OnInit {

    @Input() player: Player;

    constructor() {
    }

    ngOnInit() {
    }

}
