import {NgModule} from '@angular/core';
import {TeamMatchDetailsRoutingModule} from './team-match-details-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {TeamMatchDetailsPage} from './containers/team-match-details/team-match-details-page.component';
import {TeamMatchPlayerListComponent} from './components/team-match-player-list/team-match-player-list.component';
import {TeamMatchPlayerItemComponent} from './components/team-match-player-list/team-match-player-item/team-match-player-item.component';
import {IndividualMatchesListComponent} from './components/individual-matches-list/individual-matches-list.component';
import {TeamMatchScoreComponent} from './components/team-match-score/team-match-score.component';
import {TeamMatchIndividualMatchComponent} from './components/individual-matches-list/individual-match/individual-match.component';
import { MatchSheetHelperPage } from './containers/team-match-helper-page/match-sheet-helper-page.component';
import { TeamMatchInfoListComponent } from './components/team-match-info-list/team-match-info-list.component';
import { MemberListOfStrenghCheckboxComponent } from './components/member-list-of-strengh-checkbox/member-list-of-strengh-checkbox.component';


@NgModule({
    declarations: [
        TeamMatchDetailsPage,
        TeamMatchPlayerListComponent,
        TeamMatchPlayerItemComponent,
        IndividualMatchesListComponent,
        TeamMatchScoreComponent,
        TeamMatchIndividualMatchComponent,
        MatchSheetHelperPage,
        TeamMatchInfoListComponent,
        MemberListOfStrenghCheckboxComponent
    ],
    imports: [
        SharedModule,
        TeamMatchDetailsRoutingModule
    ]
})
export class TeamMatchDetailsModule {
}
