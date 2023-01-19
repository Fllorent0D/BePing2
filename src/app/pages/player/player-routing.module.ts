import {RouterModule, Routes} from '@angular/router';

import {OtherPlayersComponent} from './containers/other-players/other-players.component';
import {CurrentUserComponent} from './containers/current-user/current-user.component';
import {NgModule} from '@angular/core';
import {FaceToFaceComponent} from './containers/face-to-face/face-to-face.component';
import {NumericRankingOverviewComponent} from './containers/numeric-ranking-overview/numeric-ranking-overview.component';

const routes: Routes = [
    {
        path: 'face2face/:id',
        component: FaceToFaceComponent
    },
    {
        path: 'numeric-ranking-overview',
        component: NumericRankingOverviewComponent
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
