import {Component, Input, OnInit} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';

@Component({
    selector: 'beping-member-latest-matches',
    templateUrl: './member-latest-matches.component.html',
    styleUrls: ['./member-latest-matches.component.scss']
})
export class MemberLatestMatchesComponent implements OnInit {


    @Input() matches: TeamMatchesEntry[];

    constructor() {
    }

    ngOnInit() {
    }

}
