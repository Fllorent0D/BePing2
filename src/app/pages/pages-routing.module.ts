import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./explore-container/explore-container.module').then(m => m.ExploreContainerComponentModule)
    },
    {
        path: 'clubs',
        loadChildren: () => import('./club/clubs.module').then(m => m.ClubsPagesModule)
    },
    {
        path: 'player',
        loadChildren: () => import('./player/player.module').then(m => m.PlayerPageModule)
    },
    {
        path: 'matches',
        loadChildren: () => import('./matches/matches.module').then(m => m.MatchesPageModule)
    },
    {
        path: 'matches',
        outlet: 'modal-outlet',
        loadChildren: () => import('./matches/matches.module').then(m => m.MatchesPageModule)
    },
    {
        path: 'team-match-details',
        loadChildren: () => import('./team-match-details/team-match-details.module').then(m => m.TeamMatchDetailsModule)
    },
    {
        path: 'team-match-details',
        outlet: 'modal-outlet',
        loadChildren: () => import('./team-match-details/team-match-details.module').then(m => m.TeamMatchDetailsModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
    },
    {
        path: 'tournaments',
        loadChildren: () => import('./tournaments/tournaments.module').then(m => m.TournamentsModule)
    },
    {
        path: 'search',
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
    },
    {
        path: 'divisions',
        loadChildren: () => import('./division/division.module').then(m => m.DivisionModule)
    },
    {
        path: 'points-calculator',
        loadChildren: () => import('./points-calculator/points-calculator.module').then(m => m.PointsCalculatorModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
