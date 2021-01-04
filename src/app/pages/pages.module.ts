import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ExploreContainerComponentModule} from './explore-container/explore-container.module';
import {PagesRoutingModule} from './pages-routing.module';
import {ModalsModule} from './modals/modals.module';


@NgModule({
    declarations: [],
    imports: [
        IonicModule,
        ModalsModule,
        ExploreContainerComponentModule,
        CommonModule,
        PagesRoutingModule
    ]
})
export class PagesModule {
}
