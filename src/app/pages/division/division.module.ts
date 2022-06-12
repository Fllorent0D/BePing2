import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {DivisionPageComponent} from './containers/division-page/division-page.component';
import {DivisionRoutingModule} from './division-routing.module';
import {DivisionsPageComponent} from './containers/divisions-page/divisions-page.component';
import {RegionsDivisionComponent} from './containers/regions-division/regions-division.component';
import {SwiperModule} from 'swiper/angular';
import {IonicModule} from '@ionic/angular';


@NgModule({
    declarations: [
        DivisionPageComponent,
        DivisionsPageComponent,
        RegionsDivisionComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        SharedModule,
        DivisionRoutingModule,
        SwiperModule
    ]
})
export class DivisionModule {
}
