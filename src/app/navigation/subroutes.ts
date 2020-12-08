import {Routes} from '@angular/router';

export const SubRoutes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('../explore-container/explore-container.module').then((m) => m.ExploreContainerComponentModule)
    }
];
