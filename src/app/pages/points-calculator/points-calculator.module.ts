import {NgModule} from '@angular/core';
import {PointsCalculatorRoutingModule} from './points-calculator-routing.module';
import {PointsCalculatorPageComponent} from './containers/points-calculator-page/points-calculator-page.component';
import {SharedModule} from '../../shared/shared.module';
import {IndividualMatchPointsEditorComponent} from './containers/individual-match-points-editor/individual-match-points-editor.component';


@NgModule({
    declarations: [
        PointsCalculatorPageComponent,
        IndividualMatchPointsEditorComponent
    ],
    imports: [
        SharedModule,
        PointsCalculatorRoutingModule,
    ]
})
export class PointsCalculatorModule {
}
