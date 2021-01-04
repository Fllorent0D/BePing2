import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ClubPage} from './containers/club/club.page';
import {TeamPage} from './containers/team/team-page.component';

const routes: Routes = [
    {
        path: '',
        component: ClubPage
    },
    {
        path: ':uniqueIndex/team/:teamId',
        component: TeamPage
    },
    {
        path: ':uniqueIndex',
        component: ClubPage
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClubPageRoutingModule {
}
