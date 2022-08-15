import {NgModule} from '@angular/core';

import {ExploreContainerComponent} from './explore-container.component';
import {Tab1PageRoutingModule} from './explorer-container.module';
import {SharedModule} from '../../shared/shared.module';
import {ModalsModule} from '../modals/modals.module';

@NgModule({
    imports: [
        SharedModule,
        Tab1PageRoutingModule,
        ModalsModule
    ],
    declarations: [
        ExploreContainerComponent
    ]
})
export class ExploreContainerComponentModule {
}
