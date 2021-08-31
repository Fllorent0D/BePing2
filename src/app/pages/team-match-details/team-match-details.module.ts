import {NgModule} from '@angular/core';
import {TeamMatchDetailsRoutingModule} from './team-match-details-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {TeamMatchDetailsPage} from './containers/team-match-details/team-match-details-page.component';
import {TeamMatchPlayerListComponent} from './components/team-match-player-list/team-match-player-list.component';
import {TeamMatchPlayerItemComponent} from './components/team-match-player-list/team-match-player-item/team-match-player-item.component';
import {IndividualMatchesListComponent} from './components/individual-matches-list/individual-matches-list.component';
import {TeamMatchScoreComponent} from './components/team-match-score/team-match-score.component';
import {TeamMatchIndividualMatchComponent} from './components/individual-matches-list/individual-match/individual-match.component';


@NgModule({
    declarations: [
        TeamMatchDetailsPage,
        TeamMatchPlayerListComponent,
        TeamMatchPlayerItemComponent,
        IndividualMatchesListComponent,
        TeamMatchScoreComponent,
        TeamMatchIndividualMatchComponent
    ],
    imports: [
        SharedModule,
        TeamMatchDetailsRoutingModule
    ]
})
export class TeamMatchDetailsModule {
}
