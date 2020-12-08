import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExploreContainerComponent} from './explore-container.component';

const routes: Routes = [
  {
    path: '',
    component: ExploreContainerComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Tab1PageRoutingModule {
}
