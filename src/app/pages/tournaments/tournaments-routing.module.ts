import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TournamentsPageComponent} from './containers/tournaments-page/tournaments-page.component';
import {TournamentDetailPageComponent} from './containers/tournament-detail-page/tournament-detail-page.component';

const routes: Routes = [
  {
    path: '',
    component: TournamentsPageComponent
  },
  {
    path: ':id',
    component: TournamentDetailPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule {
}
