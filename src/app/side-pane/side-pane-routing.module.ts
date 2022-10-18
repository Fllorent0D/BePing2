import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HasSeenOnboardingGuard} from '../shared/guards/has-seen-onboarding.guard';
import {SidePaneLayoutComponent} from './side-pane-layout/side-pane-layout.component';


@NgModule({
    imports: [
        RouterModule.forChild([
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
                component: SidePaneLayoutComponent,
                canActivate: [HasSeenOnboardingGuard],
                children: [
                    {
                        path: 'homeTab',
                        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'favoritesTab',
                        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'divisionsTab',
                        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'tournamentsTab',
                        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'searchTab',
                        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'settingsTab',
                        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: 'calculatorTab',
                        loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
                    },
                    {
                        path: '',
                        redirectTo: 'homeTab/home',
                        pathMatch: 'full'
                    }
                ]
            }
        ])
    ]
})
export class SidePaneRoutingModule {
}
