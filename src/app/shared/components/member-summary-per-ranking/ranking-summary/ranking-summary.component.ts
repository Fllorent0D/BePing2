import {Component, Input, OnInit} from '@angular/core';
import {MemberEntryResultEntry} from '../../../../core/api/models/member-entry-result-entry';

@Component({
    selector: 'beping-ranking-summary',
    templateUrl: './ranking-summary.component.html',
    styleUrls: ['./ranking-summary.component.scss']
})
export class RankingSummaryComponent implements OnInit {

    @Input() ranking = '';

    victories = 0;
    victoriesPct = 0;
    defeats = 0;
    defeatsPct = 0;
    total = 0;

    @Input() isOpen = false;

    completeResults: MemberEntryResultEntry[];

    @Input() set results(results: MemberEntryResultEntry[]) {
        if (!results) {
            results = [];
        }
        this.completeResults = results;
        this.victories = results.filter((result) => result.Result === 'V').length;
        this.defeats = results.filter((result) => result.Result === 'D').length;
        this.total = results.length;
        this.defeatsPct = Math.floor((this.defeats / this.total) * 100);
        this.victoriesPct = Math.floor((this.victories / this.total) * 100);
    }

    constructor() {
    }

    ngOnInit() {
    }

}
