import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {NumericRankingPerWeekOpponentsV3} from '../../../core/api/models/numeric-ranking-per-week-opponents-v-3';
import {TabsNavigationService} from '../../../core/services/navigation/tabs-navigation.service';
import {NumericRankingDetailsV3} from '../../../core/api/models/numeric-ranking-details-v-3';
import {SwiperOptions} from 'swiper';
import {SwiperComponent} from 'swiper/angular';

@Component({
    selector: 'beping-last-opponents',
    templateUrl: './last-opponents.component.html',
    styleUrls: ['./last-opponents.component.scss']
})
export class LastOpponentsComponent implements OnInit {
    _numericRankingDetails: NumericRankingDetailsV3[] = [];
    @Input() set numericRankingDetails(numericRankingDetails: NumericRankingDetailsV3[]) {
        this._numericRankingDetails = numericRankingDetails ?? [];
        this.changeDetectorRef.detectChanges();
        this.swiper?.swiperRef.updateSize();

        console.log('numericRankingDetails', numericRankingDetails);
    }

    @ViewChild('swiper') swiper: SwiperComponent;
    swiperConfig: SwiperOptions = {
        slidesPerView: 1.1,
        spaceBetween: 0,
        autoHeight: true,
        breakpoints: {
            640: {
                slidesPerView: 2.1,
                spaceBetween: 0
            },
            820: {
                slidesPerView: 3.1,
                spaceBetween: 0
            }
        }
    };

    constructor(
        private readonly tabsNavigationService: TabsNavigationService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.swiper?.swiperRef.updateSize();
        }, 2000);

    }

    get lastOpponents(): NumericRankingPerWeekOpponentsV3[] {
        return this._numericRankingDetails?.[this._numericRankingDetails.length - 1]?.opponents ?? [];
    }

    openRankingOverview() {
        this.tabsNavigationService.navigateTo('player/numeric-ranking-overview', {state: {weeklyRanking: this.numericRankingDetails}});
    }

    navigateToPlayer(opponentUniqueIndex: number) {
        this.tabsNavigationService.navigateTo('player/' + opponentUniqueIndex);
    }
}
