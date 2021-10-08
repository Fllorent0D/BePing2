import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SettingsPage} from './containers/settings-page/settings.page';
import {AfttLoginPage} from '../modals/aftt-login/aftt-login-page.component';
import {ContactComponent} from './containers/contact/contact.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsPage
    },
    {
        path: 'aftt-login',
        component: AfttLoginPage
    },
    {
        path: 'contact',
        component: ContactComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsPageRoutingModule {
}
