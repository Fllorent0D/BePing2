import {Component, Input, OnInit} from '@angular/core';
import {MemberEntryResultEntry} from '../../../core/api/models/member-entry-result-entry';

@Component({
    selector: 'beping-member-victory-chart',
    templateUrl: './member-victory-chart.component.html',
    styleUrls: ['./member-victory-chart.component.scss']
})
export class MemberVictoryChartComponent {

    victories = 0;
    victoriesPct = 0;
    defeats = 0;
    defeatsPct = 0;
    total = 0;


    @Input() set memberResultEntries(memberResultEntries: MemberEntryResultEntry[]) {
        if (!memberResultEntries) {
            memberResultEntries = [];
        }
        this.victories = memberResultEntries.filter((result) => result.Result === 'V').length;
        this.defeats = memberResultEntries.filter((result) => result.Result === 'D').length;
        this.total = memberResultEntries.length;
        this.defeatsPct = Math.round((this.defeats / this.total) * 100);
        this.victoriesPct = Math.round((this.victories / this.total) * 100);
    }
}
