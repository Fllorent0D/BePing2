import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';
import {Player} from '../../../../core/api/models/player';

@Component({
    selector: 'beping-individual-matches-list',
    templateUrl: './individual-matches-list.component.html',
    styleUrls: ['./individual-matches-list.component.scss']
})
export class IndividualMatchesListComponent implements OnInit {
    @Input() match: TeamMatchesEntry;

    constructor() {
    }

    ngOnInit() {
    }

    getPlayerWithId(uniqueIndex: number[]): Player[] {
        return [...this.match?.MatchDetails?.AwayPlayers?.Players ?? [], ...this.match?.MatchDetails?.HomePlayers?.Players ?? []]
            .filter((player) => uniqueIndex?.includes(player.UniqueIndex));
    }

}
