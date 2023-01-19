import {Component, Input, OnInit} from '@angular/core';
import {NumericRankingPerWeekOpponentsV3} from '../../../core/api/models/numeric-ranking-per-week-opponents-v-3';

@Component({
    selector: 'beping-last-opponents',
    templateUrl: './last-opponents.component.html',
    styleUrls: ['./last-opponents.component.scss']
})
export class LastOpponentsComponent implements OnInit {

    @Input() lastOpponents: NumericRankingPerWeekOpponentsV3[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
