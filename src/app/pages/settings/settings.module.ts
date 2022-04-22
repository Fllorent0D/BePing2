import {NgModule} from '@angular/core';

import {SettingsPageRoutingModule} from './settings-routing.module';

import {SettingsPage} from './containers/settings-page/settings.page';
import {SharedModule} from '../../shared/shared.module';
import {ModalsModule} from '../modals/modals.module';
import {ContactComponent} from './containers/contact/contact.component';
import {PrivacyComponent} from './containers/privacy/privacy.component';
import {ConditionsUsageComponent} from './containers/conditions-usage/conditions-usage.component';
import {PremiumSubscriptionsComponent} from './containers/premium-subscriptions/premium-subscriptions.component';
import {ContributorsComponent} from './containers/contributors/contributors.component';

@NgModule({
    imports: [
        SettingsPageRoutingModule,
        SharedModule,
        ModalsModule
    ],
    declarations: [
        SettingsPage,
        ContactComponent,
        PrivacyComponent,
        ConditionsUsageComponent,
        PremiumSubscriptionsComponent,
        ContributorsComponent
    ]
})
export class SettingsPageModule {
}
