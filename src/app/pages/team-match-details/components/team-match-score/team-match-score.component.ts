import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TeamMatchesEntry} from '../../../../core/api/models/team-matches-entry';

@Component({
    selector: 'beping-team-match-score',
    templateUrl: './team-match-score.component.html',
    styleUrls: ['./team-match-score.component.scss']
})
export class TeamMatchScoreComponent implements OnInit {
    @Input() match: TeamMatchesEntry;

    @Output() homeTeamClicked: EventEmitter<void> = new EventEmitter<void>();
    @Output() awayTeamClicked: EventEmitter<void> = new EventEmitter<void>();

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
        if (this.isHomeFF) {
            return 0;
        }
        if (this.isAwayFF) {
            return 100;
        }
        return (this.homeScore / (this.homeScore + this.awayScore)) * 100 - 0.5;
    }

    get awayScorePct() {
        if (this.isAwayFF) {
            return 0;
        }
        if (this.isHomeFF) {
            return 100;
        }
        return (this.awayScore / (this.homeScore + this.awayScore)) * 100 - 0.5;
    }

    get isHomeFF(): boolean {
        return this.match.IsHomeForfeited && !this.isAwayFG;
    }

    get isAwayFF(): boolean {
        return this.match.IsAwayForfeited && !this.isHomeFG;
    }

    get isHomeFG(): boolean {
        return this.match.IsHomeWithdrawn;
    }

    get isAwayFG(): boolean {
        return this.match.IsAwayWithdrawn;
    }


    teamClicked(team: string) {

    }
}
