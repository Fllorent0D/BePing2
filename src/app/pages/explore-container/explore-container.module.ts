import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ExploreContainerComponent} from './explore-container.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SettingsPageModule} from '../settings/settings.module';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, SharedModule, RouterModule, SettingsPageModule],
    declarations: [ExploreContainerComponent],
    exports: [ExploreContainerComponent]
})
export class ExploreContainerComponentModule {
}
