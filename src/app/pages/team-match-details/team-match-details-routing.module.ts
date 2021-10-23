import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeamMatchDetailsPage} from './containers/team-match-details/team-match-details-page.component';
import {MatchSheetHelperPage} from './containers/team-match-helper-page/match-sheet-helper-page.component';

const routes: Routes = [
    {
        path: 'match-sheet-helper',
        component: MatchSheetHelperPage
    },
    {
        path: ':uniqueIndex',
        component: TeamMatchDetailsPage
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamMatchDetailsRoutingModule {
}
