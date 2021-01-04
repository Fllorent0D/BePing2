import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesPageRoutingModule } from './matches-routing.module';

import { MatchesPage } from './matches.page';
import {SharedModule} from '../../shared/shared.module';
import {SuperTabsModule} from '@ionic-super-tabs/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MatchesPageRoutingModule,
        SharedModule,
        SuperTabsModule
    ],
  declarations: [MatchesPage]
})
export class MatchesPageModule {}
