import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidePaneLayoutComponent} from './side-pane-layout/side-pane-layout.component';
import {SidePaneRoutingModule} from './side-pane-routing.module';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import { SidePaneMenuComponent } from './side-pane-menu/side-pane-menu.component';


@NgModule({
    declarations: [
        SidePaneLayoutComponent,
        SidePaneMenuComponent
    ],
    imports: [
        CommonModule,
        SidePaneRoutingModule,
        SharedModule,
        RouterModule
    ]
})
export class SidePaneModule {
}
