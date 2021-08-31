import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ExploreContainerComponent} from './explore-container.component';
import {Tab1PageRoutingModule} from './explorer-container.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        Tab1PageRoutingModule
    ],
    declarations: [
        ExploreContainerComponent
    ]
})
export class ExploreContainerComponentModule {
}
