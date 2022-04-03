import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatchEntryHistory} from '../../../../../../core/api/models/match-entry-history';
import {PlayersInfo} from '../../../../../../core/api/models/players-info';

@Component({
    selector: 'beping-individual-head-to-head',
    templateUrl: './individual-head-to-head.component.html',
    styleUrls: ['./individual-head-to-head.component.css']
})
export class IndividualHeadToHeadComponent implements OnInit {

    @Input() result: MatchEntryHistory;
    @Input() playersInfo: PlayersInfo;
    @Output() matchClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    get setFor() {
        return Number(this.result?.score.split(' - ')[0]);
    }

    get setAgainst() {
        return Number(this.result?.score.split(' - ')[1]);
    }

}
