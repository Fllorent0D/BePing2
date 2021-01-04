import {Component, Input, OnInit} from '@angular/core';
import {MemberEntryResultEntry} from '../../../core/api/models/member-entry-result-entry';

@Component({
    selector: 'beping-individual-match',
    templateUrl: './individual-match.component.html',
    styleUrls: ['./individual-match.component.scss']
})
export class IndividualMatchComponent implements OnInit {

    @Input() result?: MemberEntryResultEntry = null;

    constructor() {
    }

    ngOnInit() {
    }

}
