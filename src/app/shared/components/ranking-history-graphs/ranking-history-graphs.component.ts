import {Component, Input, OnInit} from '@angular/core';
import {WeeklyNumericRanking} from '../../../core/api/models/weekly-numeric-ranking';
import {Platform} from '@ionic/angular';
import {PLAYER_CATEGORY} from '../../../core/models/user';

@Component({
    selector: 'beping-ranking-history-graphs',
    templateUrl: './ranking-history-graphs.component.html',
    styleUrls: ['./ranking-history-graphs.component.scss']
})
export class RankingHistoryGraphsComponent implements OnInit {

    @Input() displayElo: boolean;
    @Input() displayNumericRanking: boolean;
    @Input() numericRankings: WeeklyNumericRanking[];
    @Input() category: PLAYER_CATEGORY;
    isTablet: boolean;

    constructor(
        private readonly platform: Platform
    ) {
    }

    ngOnInit() {
        this.isTablet = this.platform.is('tablet') || this.platform.is('desktop');
    }

    get graphDisplayed(): number {
        return 12 / (Number(this.displayElo) + Number(this.displayNumericRanking));
    }

}
