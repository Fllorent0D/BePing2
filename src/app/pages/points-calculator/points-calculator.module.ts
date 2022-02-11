import {NgModule} from '@angular/core';
import {PointsCalculatorRoutingModule} from './points-calculator-routing.module';
import {PointsCalculatorPageComponent} from './containers/points-calculator-page/points-calculator-page.component';
import {SharedModule} from '../../shared/shared.module';
import {IndividualMatchPointsEditorComponent} from './containers/individual-match-points-editor/individual-match-points-editor.component';
import {ModalsModule} from '../modals/modals.module';
import { CalculatorResultsListComponent } from './components/calculator-results-list/calculator-results-list.component';


@NgModule({
    declarations: [
        PointsCalculatorPageComponent,
        IndividualMatchPointsEditorComponent,
        CalculatorResultsListComponent
    ],
    imports: [
        SharedModule,
        ModalsModule,
        PointsCalculatorRoutingModule,
    ],
    exports: [
        IndividualMatchPointsEditorComponent
    ]
})
export class PointsCalculatorModule {
}
