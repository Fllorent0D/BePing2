import {NgModule} from '@angular/core';
import {TournamentsRoutingModule} from './tournaments-routing.module';
import {TournamentsPageComponent} from './containers/tournaments-page/tournaments-page.component';
import {TournamentFiltersComponent} from './components/tournament-filters/tournament-filters.component';
import {TournamentDetailPageComponent} from './containers/tournament-detail-page/tournament-detail-page.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {TournamentRegistrationModalComponent} from './containers/tournament-registration-modal/tournament-registration-modal.component';
import {TournamentSeriesDetailsComponent} from './containers/tournament-series-details/tournament-series-details.component';
import {TournamentRegistrationsPageComponent} from './containers/tournament-registrations-page/tournament-registrations-page.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [
        TournamentsPageComponent,
        TournamentFiltersComponent,
        TournamentDetailPageComponent,
        TournamentRegistrationModalComponent,
        TournamentSeriesDetailsComponent,
        TournamentRegistrationsPageComponent
    ],
    imports: [
        TournamentsRoutingModule,
        SharedModule,
        LeafletModule
    ]
})
export class TournamentsModule {
}
