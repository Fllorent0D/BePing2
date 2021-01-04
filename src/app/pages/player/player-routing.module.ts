import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PlayerPage} from './player.page';

const routes: Routes = [
    {
        path: '',
        component: PlayerPage
    },
    {
        path: ':id',
        component: PlayerPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerPageRoutingModule {
}
