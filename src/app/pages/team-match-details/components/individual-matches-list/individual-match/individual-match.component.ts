import {Component, Input, OnInit} from '@angular/core';
import {IndividualMatchResult} from '../../../../../core/api/models/individual-match-result';
import {Player} from '../../../../../core/api/models/player';

@Component({
    selector: 'beping-team-match-individual-match',
    templateUrl: './individual-match.component.html',
    styleUrls: ['./individual-match.component.scss']
})
export class TeamMatchIndividualMatchComponent implements OnInit {
    @Input() individualMatch: IndividualMatchResult;
    @Input() homePlayer: Player[];
    @Input() awayPlayer: Player[];

    constructor() {
    }

    ngOnInit() {
        console.log(this.homePlayer);
    }

}
