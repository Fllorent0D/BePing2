import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiModule} from './api/api.module';
import {environment} from '../../environments/environment';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {listState} from './store';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ApiModule.forRoot({
            rootUrl: environment.tabtUrl
        }),
        NgxsModule.forRoot(
            listState,
            {
                developmentMode: !environment.production
            }
        ),
        NgxsLoggerPluginModule.forRoot({
            disabled: environment.production
        }),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production
        })
    ]
})
export class CoreModule {
}
