import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MatchesPage} from './matches.page';

const routes: Routes = [
    {
        path: '',
        component: MatchesPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MatchesPageRoutingModule {
}
