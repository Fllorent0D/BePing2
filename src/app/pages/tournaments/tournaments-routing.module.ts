import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentsPageComponent} from './containers/tournaments-page/tournaments-page.component';
import {TournamentDetailPageComponent} from './containers/tournament-detail-page/tournament-detail-page.component';
import {TournamentSeriesDetailsComponent} from './containers/tournament-series-details/tournament-series-details.component';
import {TournamentRegistrationsPageComponent} from './containers/tournament-registrations-page/tournament-registrations-page.component';

const routes: Routes = [
    {
        path: ':id/series/registrations/:seriesIndex',
        component: TournamentRegistrationsPageComponent
    },
    {
        path: ':id/series',
        component: TournamentSeriesDetailsComponent
    },
    {
        path: ':id',
        component: TournamentDetailPageComponent
    },
    {
        path: '',
        component: TournamentsPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TournamentsRoutingModule {
}
