import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {TabletGuard} from './core/guards/tablet.guard';

const routes: Routes = [
    {
        path: 'tabs',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
        pathMatch: 'prefix'
    },
    {
        path: 'side-pane',
        loadChildren: () => import('./side-pane/side-pane.module').then(m => m.SidePaneModule),
        pathMatch: 'prefix'
    },
    {
        path: 'onboarding',
        loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingPageModule),
        pathMatch: 'prefix'
    },
    {
        path: '',
        redirectTo: 'tabs',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, enableTracing: true})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
