import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TournamentsRoutingModule} from './tournaments-routing.module';
import {TournamentsPageComponent} from './containers/tournaments-page/tournaments-page.component';
import {IonicModule} from '@ionic/angular';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TournamentFiltersComponent} from './components/tournament-filters/tournament-filters.component';
import { TournamentDetailPageComponent } from './containers/tournament-detail-page/tournament-detail-page.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {TournamentRegistrationModalComponent} from './containers/tournament-registration-modal/tournament-registration-modal.component';


@NgModule({
    declarations: [
        TournamentsPageComponent,
        TournamentFiltersComponent,
        TournamentDetailPageComponent,
        TournamentRegistrationModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule,
        TournamentsRoutingModule,
        LeafletModule
    ]
})
export class TournamentsModule {
}
