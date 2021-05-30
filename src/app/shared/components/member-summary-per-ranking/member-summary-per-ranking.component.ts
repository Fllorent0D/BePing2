import {Component, Input, OnInit} from '@angular/core';
import {MemberEntryResultEntry} from '../../../core/api/models/member-entry-result-entry';
import {Platform} from '@ionic/angular';

@Component({
    selector: 'beping-member-summary-per-ranking',
    templateUrl: './member-summary-per-ranking.component.html',
    styleUrls: ['./member-summary-per-ranking.component.scss']
})
export class MemberSummaryPerRankingComponent {

    resultsPerRanking: object;
    isTablet: boolean;

    constructor(
        private readonly platform: Platform
    ) {
        this.isTablet = this.platform.is('tablet') || this.platform.is('desktop');
    }

    @Input() set memberResultEntries(memberResultEntries: MemberEntryResultEntry[]) {
        if (!memberResultEntries) {
            memberResultEntries = [];
        }
        this.resultsPerRanking = memberResultEntries.reduce((acc, value) => {
            if (acc[value.Ranking]) {
                acc[value.Ranking].push(value);
            } else {
                acc[value.Ranking] = [value];
            }
            return acc;
        }, {});
        console.log(this.resultsPerRanking);
    }
}
