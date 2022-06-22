import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {DivisionPageComponent} from './containers/division-page/division-page.component';
import {DivisionRoutingModule} from './division-routing.module';
import {DivisionsPageComponent} from './containers/divisions-page/divisions-page.component';
import {RegionsDivisionComponent} from './containers/regions-division/regions-division.component';


@NgModule({
    declarations: [
        DivisionPageComponent,
        DivisionsPageComponent,
        RegionsDivisionComponent
    ],
    imports: [
        SharedModule,
        DivisionRoutingModule,
    ]
})
export class DivisionModule {
}
