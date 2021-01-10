import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';

@Component({
    selector: 'beping-team-match-score',
    templateUrl: './team-match-score.component.html',
    styleUrls: ['./team-match-score.component.scss']
})
export class TeamMatchScoreComponent implements OnInit {
    @Input() match: TeamMatchesEntry;

    constructor() {
    }

    ngOnInit() {
    }

    get homeScore(): number {
        return Number(this.match.Score.split('-')[0]);
    }

    get awayScore(): number {
        return Number(this.match.Score.split('-')[1]);
    }

    get homeScorePct() {
        return (this.homeScore / (this.homeScore + this.awayScore)) * 100 - 0.5;
    }

    get awayScorePct() {
        return (this.awayScore / (this.homeScore + this.awayScore)) * 100 - 0.5;
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
