import {Component, Input, OnInit} from '@angular/core';
import {NumericRankingPerWeekOpponentsV3} from '../../../core/api/models/numeric-ranking-per-week-opponents-v-3';
import {TabsNavigationService} from '../../../core/services/navigation/tabs-navigation.service';
import {NumericRankingDetailsV3} from '../../../core/api/models/numeric-ranking-details-v-3';

@Component({
    selector: 'beping-last-opponents',
    templateUrl: './last-opponents.component.html',
    styleUrls: ['./last-opponents.component.scss']
})
export class LastOpponentsComponent implements OnInit {
    @Input() numericRankingDetails: NumericRankingDetailsV3[];

    constructor(
        private readonly tabsNavigationService: TabsNavigationService
    ) {
    }

    ngOnInit(): void {
    }

    get lastOpponents(): NumericRankingPerWeekOpponentsV3[] {
        return this.numericRankingDetails?.[this.numericRankingDetails.length - 1]?.opponents ?? [];
    }

    openRankingOverview() {
        console.log(this.numericRankingDetails);
        this.tabsNavigationService.navigateTo('player/numeric-ranking-overview', {state: {weeklyRanking: this.numericRankingDetails}});
    }
}
