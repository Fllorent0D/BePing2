import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TeamMatchDetailsPage} from '../team-match-details/containers/team-match-details/team-match-details-page.component';
import {DivisionPageComponent} from './containers/division-page/division-page.component';
import {RegionsDivisionComponent} from './containers/regions-division/regions-division.component';
import {DivisionsPageComponent} from './containers/divisions-page/divisions-page.component';

const routes: Routes = [
  {
    path: 'regions',
    component: RegionsDivisionComponent
  },
  {
    path: 'regions/:level',
    component: DivisionsPageComponent

  },
  {
    path: ':divisionId',
    component: DivisionPageComponent
  },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DivisionRoutingModule { }
