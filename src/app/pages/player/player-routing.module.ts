import {RouterModule, Routes} from '@angular/router';

import {OtherPlayersComponent} from './containers/other-players/other-players.component';
import {CurrentUserComponent} from './containers/current-user/current-user.component';
import {NgModule} from '@angular/core';
import {FaceToFaceComponent} from './containers/face-to-face/face-to-face.component';

const routes: Routes = [
    {
        path: 'face2face/:id',
        component: FaceToFaceComponent
    },
    {
        path: '',
        component: CurrentUserComponent
    },
    {
        path: ':id',
        component: OtherPlayersComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerPageRoutingModule {
}
