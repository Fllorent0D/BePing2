import {Component, Input} from '@angular/core';
import {MemberEntryResultEntry} from '../../../core/api/models/member-entry-result-entry';

@Component({
    selector: 'beping-tie-break-played',
    templateUrl: './tie-break-played.component.html',
    styleUrls: ['./tie-break-played.component.scss']
})
export class TieBreakPlayedComponent {

    victories = 0;
    victoriesPct = 0;
    defeats = 0;
    defeatsPct = 0;
    totalTieBreak = 0;
    totalTieBreakPct = 0;
    total = 0;


    @Input() set memberResultEntries(memberResultEntries: MemberEntryResultEntry[]) {
        if (!memberResultEntries) {
            memberResultEntries = [];
        }
        this.victories = memberResultEntries.filter((result) => result.SetFor === 3 && result.SetAgainst === 2).length;
        this.defeats = memberResultEntries.filter((result) => result.SetFor === 2 && result.SetAgainst === 3).length;
        this.totalTieBreak = this.victories + this.defeats;
        this.total = memberResultEntries.length;
        this.totalTieBreakPct = Math.floor((this.totalTieBreak / this.total) * 100);
        this.defeatsPct = Math.floor((this.defeats / this.totalTieBreak) * 100);
        this.victoriesPct = Math.floor((this.victories / this.totalTieBreak) * 100);
    }
}
