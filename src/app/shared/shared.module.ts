import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RankingComponent} from './components/ranking/ranking.component';
import {IonicModule} from '@ionic/angular';
import {InfoTeamMatchComponent} from './components/info-team-match/info-team-match.component';
import {IonDotDotDotDividerComponent} from './components/ion-dot-dot-dot-divider/ion-dot-dot-dot-divider.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ListHeaderDatesComponent} from './components/list-header-dates/list-header-dates.component';
import {FavoriteBtnComponent} from './components/favorite-btn/favorite-btn.component';
import {LoadingBtnComponent} from './components/loading-btn/loading-btn.component';
import {VictoryChartComponent} from './components/victory-chart/victory-chart.component';
import {BepingCardComponent} from './components/card/beping-card.component';
import {IndividualMatchComponent} from './components/individual-match/individual-match.component';
import {TeamMatchResultComponent} from './components/team-match-result/team-match-result.component';
import {TieBreakPlayedComponent} from './components/tie-break-played/tie-break-played.component';
import {MemberNameRankingInfoComponent} from './components/member-name-ranking-info/member-name-ranking-info.component';
import {MemberVictoryChartComponent} from './components/member-victory-chart/member-victory-chart.component';
import {MemberSummaryPerRankingComponent} from './components/member-summary-per-ranking/member-summary-per-ranking.component';
import {SectionTitleComponent} from './components/section-title/section-title.component';
import {MemberLatestMatchesComponent} from './components/member-latest-matches/member-latest-matches.component';
import {RankingSummaryComponent} from './components/member-summary-per-ranking/ranking-summary/ranking-summary.component';
import { AppearDirective } from './directives/appear.directive';
import {TeamResultAdBannerComponent} from './ads/team-result-ad-banner/team-result-ad-banner.component';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [
        RankingComponent,
        InfoTeamMatchComponent,
        IonDotDotDotDividerComponent,
        ListHeaderDatesComponent,
        FavoriteBtnComponent,
        LoadingBtnComponent,
        VictoryChartComponent,
        BepingCardComponent,
        IndividualMatchComponent,
        TeamMatchResultComponent,
        TieBreakPlayedComponent,
        MemberNameRankingInfoComponent,
        MemberVictoryChartComponent,
        MemberSummaryPerRankingComponent,
        SectionTitleComponent,
        MemberLatestMatchesComponent,
        RankingSummaryComponent,
        AppearDirective,
        TeamResultAdBannerComponent,
    ],
    exports: [
        RankingComponent,
        InfoTeamMatchComponent,
        ListHeaderDatesComponent,
        FavoriteBtnComponent,
        LoadingBtnComponent,
        VictoryChartComponent,
        BepingCardComponent,
        IndividualMatchComponent,
        TeamMatchResultComponent,
        TieBreakPlayedComponent,
        MemberNameRankingInfoComponent,
        MemberVictoryChartComponent,
        MemberSummaryPerRankingComponent,
        MemberLatestMatchesComponent,
        TeamResultAdBannerComponent,
        SectionTitleComponent,
        TranslateModule,
    ],
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
    ]
})
export class SharedModule {
}
