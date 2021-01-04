import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ClubPageRoutingModule} from './club-routing.module';

import {ClubPage} from './containers/club/club.page';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {SharedModule} from '../../shared/shared.module';
import {TeamPage} from './containers/team/team-page.component';

@NgModule({
    imports: [
        CommonModule,
        SuperTabsModule,
        FormsModule,
        IonicModule,
        ClubPageRoutingModule,
        SharedModule
    ],
    declarations: [
        ClubPage,
        TeamPage
    ]
})
export class ClubPageModule {
}
