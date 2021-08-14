import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ExploreContainerComponent} from './explore-container.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SettingsPageModule} from '../settings/settings.module';
import {WeeklyEloComponent} from './weekly-elo/weekly-elo.component';
import {NgChartsModule} from 'ng2-charts';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        SharedModule,
        RouterModule,
        SettingsPageModule,
        NgChartsModule
    ],
    declarations: [
        ExploreContainerComponent,
        WeeklyEloComponent
    ],
    exports: [
        ExploreContainerComponent,
        WeeklyEloComponent
    ]
})
export class ExploreContainerComponentModule {
}
