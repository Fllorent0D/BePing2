import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './containers/settings-page/settings.page';
import {AfttLoginPage} from './containers/aftt-login/aftt-login-page.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'aftt-login',
    component: AfttLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
