import {NgModule} from '@angular/core';

import {PlayerPageRoutingModule} from './player-routing.module';

import {SharedModule} from '../../shared/shared.module';
import {OtherPlayersComponent} from './containers/other-players/other-players.component';
import {CurrentUserComponent} from './containers/current-user/current-user.component';
import {PlayerContentComponent} from './components/player-content/player-content.component';

@NgModule({
    imports: [
        PlayerPageRoutingModule,
        SharedModule
    ],
    declarations: [
        OtherPlayersComponent,
        CurrentUserComponent,
        PlayerContentComponent
    ]
})
export class PlayerPageModule {
}
