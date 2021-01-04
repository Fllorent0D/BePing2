import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';

@Component({
    selector: 'beping-team-match-result',
    templateUrl: './team-match-result.component.html',
    styleUrls: ['./team-match-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamMatchResultComponent implements OnInit {

    @Input() match: TeamMatchesEntry;

    constructor() {
    }

    ngOnInit() {
    }

    get isHomeFF(): boolean {
        return this.match.IsHomeForfeited && !this.isAwayFG;
    }

    get isAwayFF(): boolean {
        return this.match.IsAwayForfeited && !this.isHomeFG;
    }

    get isHomeFG(): boolean {
        return this.match.IsHomeWithdrawn === '1';
    }

    get isAwayFG(): boolean {
        return this.match.IsAwayWithdrawn === '1';
    }


}
