import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExploreContainerComponent} from './explore-container/explore-container.component';

const routes: Routes = [
    {
        path: 'home',
        component: ExploreContainerComponent
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
        path: 'team-match-details',
        loadChildren: () => import('./team-match-details/team-match-details.module').then(m => m.TeamMatchDetailsModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
