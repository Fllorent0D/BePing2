import {NgModule} from '@angular/core';
import {SearchPageComponent} from './container/search-page/search-page.component';
import {SharedModule} from '../../shared/shared.module';
import {SearchRoutingModule} from './search-routing.module';


@NgModule({
    declarations: [
        SearchPageComponent
    ],
    imports: [
        SharedModule,
        SearchRoutingModule
    ]
})
export class SearchModule {
}
