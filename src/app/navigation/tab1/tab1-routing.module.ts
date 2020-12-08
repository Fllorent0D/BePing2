import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Tab1Page} from './tab1.page';
import {SubRoutes} from '../subroutes';
import {ExploreContainerComponent} from '../../explore-container/explore-container.component';

const routes: Routes = [
    {
        path: 'a',
        component: Tab1Page,
        loadChildren: () => import('../../pages/pages.module').then((m) => m.PagesModule)
    },
    {
        path: '**',
        redirectTo: 'a/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Tab1PageRoutingModule {
}
