import {NgModule} from '@angular/core';

import {SettingsPageRoutingModule} from './settings-routing.module';

import {SettingsPage} from './containers/settings-page/settings.page';
import {SharedModule} from '../../shared/shared.module';
import {ModalsModule} from '../modals/modals.module';
import {ContactComponent} from './containers/contact/contact.component';
import {PrivacyComponent} from './containers/privacy/privacy.component';
import {ConditionsUsageComponent} from './containers/conditions-usage/conditions-usage.component';

@NgModule({
    imports: [
        SettingsPageRoutingModule,
        SharedModule,
        ModalsModule
    ],
    declarations: [SettingsPage, ContactComponent, PrivacyComponent, ConditionsUsageComponent]
})
export class SettingsPageModule {
}
