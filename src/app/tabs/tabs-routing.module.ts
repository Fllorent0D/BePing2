import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {HasSeenOnboardingGuard} from '../shared/guards/has-seen-onboarding.guard';

const routes: Routes = [
    {
        path: 'homeTab',
        redirectTo: 'homeTab/home',
        pathMatch: 'full'
    },
    {
        path: 'favoritesTab',
        redirectTo: 'favoritesTab/matches',
        pathMatch: 'full'
    },
    {
        path: 'tournamentsTab',
        redirectTo: 'tournamentsTab/tournaments',
        pathMatch: 'full'
    },
    {
        path: 'searchTab',
        redirectTo: 'searchTab/search',
        pathMatch: 'full'
    },
    {
        path: 'divisionsTab',
        redirectTo: 'divisionsTab/divisions/regions',
        pathMatch: 'full'
    },
    {
        path: '',
        component: TabsPage,
        canActivate: [HasSeenOnboardingGuard],
        children: [
            {
                path: 'homeTab',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule),
                pathMatch: 'prefix'
            },
            {
                path: 'favoritesTab',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule),
                pathMatch: 'prefix'
            },
            {
                path: 'divisionsTab',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule),
                pathMatch: 'prefix'
            },
            {
                path: 'tournamentsTab',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule),
                pathMatch: 'prefix'
            },
            {
                path: 'searchTab',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule),
                pathMatch: 'prefix'
            },
            {
                path: '',
                redirectTo: 'homeTab/home',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
