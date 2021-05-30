import {Routes, RouterModule} from '@angular/router';

import {OtherPlayersComponent} from './containers/other-players/other-players.component';
import {CurrentUserComponent} from './containers/current-user/current-user.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: CurrentUserComponent
    },
    {
        path: ':id',
        component: OtherPlayersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerPageRoutingModule {
}
