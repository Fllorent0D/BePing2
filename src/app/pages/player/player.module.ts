import {NgModule} from '@angular/core';

import {PlayerPageRoutingModule} from './player-routing.module';

import {SharedModule} from '../../shared/shared.module';
import {OtherPlayersComponent} from './containers/other-players/other-players.component';
import {CurrentUserComponent} from './containers/current-user/current-user.component';
import {PlayerContentComponent} from './components/player-content/player-content.component';
import {FaceToFaceComponent} from './containers/face-to-face/face-to-face.component';
import {Head2HeadPerSeasonComponent} from './containers/face-to-face/per-season/head2-head-per-season.component';
import {
    IndividualHeadToHeadComponent
} from './containers/face-to-face/per-season/individual-head-to-head/individual-head-to-head.component';
import {FaceToFaceSummaryComponent} from './containers/face-to-face/face-to-face-summary/face-to-face-summary.component';

@NgModule({
    imports: [
        PlayerPageRoutingModule,
        SharedModule,
    ],
    declarations: [
        OtherPlayersComponent,
        CurrentUserComponent,
        PlayerContentComponent,
        FaceToFaceComponent,
        Head2HeadPerSeasonComponent,
        IndividualHeadToHeadComponent,
        FaceToFaceSummaryComponent
    ]
})
export class PlayerPageModule {
}
