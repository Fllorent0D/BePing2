import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SettingsPageRoutingModule} from './settings-routing.module';

import {SettingsPage} from './containers/settings-page/settings.page';
import {SharedModule} from '../../shared/shared.module';
import {AfttLoginPage} from './containers/aftt-login/aftt-login-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SettingsPageRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ],
    declarations: [SettingsPage, AfttLoginPage]
})
export class SettingsPageModule {
}
