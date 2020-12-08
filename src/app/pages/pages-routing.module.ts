import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';

const routes: Routes = [
    {
        path: 'home',
        component: ExploreContainerComponent
    },
    {
        path: 'club',
        loadChildren: () => import('./club/club.module').then(m => m.ClubPageModule)
    }
];

// children: SubRoutes


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
