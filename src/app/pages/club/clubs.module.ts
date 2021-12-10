import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ClubPageRoutingModule} from './clubs-routing.module';

import {ClubPage} from './containers/club/club.page';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {SharedModule} from '../../shared/shared.module';
import {TeamPage} from './containers/team/team-page.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ClubPlayerListTabComponent} from './components/club-player-list-tab/club-player-list-tab.component';
import {ClubTeamListTabComponent} from './components/club-team-list-tab/club-team-list-tab.component';
import {ClubPraticalInfoTabComponent} from './components/club-pratical-info-tab/club-pratical-info-tab.component';
import {TeamResultTabComponent} from './components/team-result-tab/team-result-tab.component';
import {TeamPlayersStatsComponent} from './components/team-players-stats/team-players-stats.component';

@NgModule({
    imports: [
        CommonModule,
        SuperTabsModule,
        FormsModule,
        IonicModule,
        ClubPageRoutingModule,
        SharedModule,
        ScrollingModule,
    ],
    declarations: [
        ClubPage,
        TeamPage,
        ClubPlayerListTabComponent,
        ClubTeamListTabComponent,
        ClubPraticalInfoTabComponent,
        TeamResultTabComponent,
        TeamPlayersStatsComponent
    ]
})
export class ClubsPagesModule {
}
