import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

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
                path: '',
                redirectTo: 'homeTab/home',
                pathMatch: 'full'
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
