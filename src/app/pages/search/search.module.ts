import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchPageComponent} from './container/search-page/search-page.component';
import {SearchRoutingModule} from './search-routing.module';
import {IonicModule} from '@ionic/angular';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
    declarations: [
        SearchPageComponent
    ],
    imports: [
        CommonModule,
        SearchRoutingModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        SharedModule
    ]
})
export class SearchModule {
}
