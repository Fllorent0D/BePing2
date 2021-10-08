import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeamMatchDetailsPage} from './containers/team-match-details/team-match-details-page.component';

const routes: Routes = [
    {
        path: ':uniqueIndex',
        component: TeamMatchDetailsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamMatchDetailsRoutingModule {
}
