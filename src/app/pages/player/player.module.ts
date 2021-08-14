import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PlayerPageRoutingModule} from './player-routing.module';

import {SharedModule} from '../../shared/shared.module';
import {OtherPlayersComponent} from './containers/other-players/other-players.component';
import {CurrentUserComponent} from './containers/current-user/current-user.component';
import {PlayerContentComponent} from './components/player-content/player-content.component';
import {ExploreContainerComponentModule} from '../explore-container/explore-container.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
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
