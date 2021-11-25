import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PointsCalculatorPageComponent} from './containers/points-calculator-page/points-calculator-page.component';
import {IndividualMatchPointsEditorComponent} from './containers/individual-match-points-editor/individual-match-points-editor.component';


const routes: Routes = [
    {
        path: '',
        component: PointsCalculatorPageComponent
    },
    {
        path: 'edition',
        component: IndividualMatchPointsEditorComponent
    }
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class PointsCalculatorRoutingModule {
}
