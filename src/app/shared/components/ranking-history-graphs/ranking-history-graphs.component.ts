import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {WeeklyNumericRanking} from '../../../core/api/models/weekly-numeric-ranking';
import {Platform} from '@ionic/angular';
import {PLAYER_CATEGORY} from '../../../core/models/user';
import {WeeklyNumericRankingV3} from '../../../core/api/models/weekly-numeric-ranking-v-3';

@Component({
    selector: 'beping-ranking-history-graphs',
    templateUrl: './ranking-history-graphs.component.html',
    styleUrls: ['./ranking-history-graphs.component.scss']
})
export class RankingHistoryGraphsComponent implements OnInit {

    @Input() displayElo: boolean;
    @Input() displayNumericRanking: boolean;
    @Input() numericRankings: WeeklyNumericRankingV3;
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
