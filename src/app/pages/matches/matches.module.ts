import {NgModule} from '@angular/core';

import {MatchesPageRoutingModule} from './matches-routing.module';

import {MatchesPage} from './matches.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        MatchesPageRoutingModule,
        SharedModule
    ],
    declarations: [MatchesPage]
})
export class MatchesPageModule {
}
