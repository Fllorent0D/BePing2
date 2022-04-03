import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatchEntryHistory} from '../../../../../core/api/models/match-entry-history';
import {PlayersInfo} from '../../../../../core/api/models/players-info';

@Component({
    selector: 'beping-head-2-head-per-season',
    templateUrl: './head2-head-per-season.component.html',
    styleUrls: ['./head2-head-per-season.component.css']
})
export class Head2HeadPerSeasonComponent implements OnInit {

    @Input() matchesPerSeason: MatchEntryHistory[][];
    @Input() playersInfo: PlayersInfo;

    @Output() matchClicked: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

}
