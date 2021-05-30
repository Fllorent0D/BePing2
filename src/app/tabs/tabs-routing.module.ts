import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

const routes: Routes = [
    {
        path: 'tab1',
        redirectTo: 'tab1/home',
        pathMatch: 'full'
    },
    {
        path: 'tab2',
        redirectTo: 'tab2/matches',
        pathMatch: 'full'
    },
    {
        path: 'tab3',
        redirectTo: 'tab3/player/142453',
        pathMatch: 'full'
    },
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'tab1',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
            },
            {
                path: 'tab2',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
            },
            {
                path: 'tab3',
                loadChildren: () => import('../pages/pages.module').then(m => m.PagesModule)
            },
            {
                path: '',
                redirectTo: 'tab1/home',
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
