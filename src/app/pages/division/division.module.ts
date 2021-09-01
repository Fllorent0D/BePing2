import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {DivisionPageComponent} from './containers/division-page/division-page.component';
import {DivisionRoutingModule} from './division-routing.module';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {DivisionsPageComponent} from './containers/divisions-page/divisions-page.component';
import {RegionsDivisionComponent} from './containers/regions-division/regions-division.component';


@NgModule({
    declarations: [
        DivisionPageComponent,
        DivisionsPageComponent,
        RegionsDivisionComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DivisionRoutingModule,
        SuperTabsModule,
        ScrollingModule
    ]
})
export class DivisionModule {
}
