import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ExploreContainerComponentModule} from '../explore-container/explore-container.module';
import {PagesRoutingModule} from './pages-routing.module';
import {ClubPageModule} from './club/club.module';


@NgModule({
    declarations: [],
    imports: [
        IonicModule,
        ExploreContainerComponentModule,
        CommonModule,
        PagesRoutingModule
    ]
})
export class PagesModule {
}
