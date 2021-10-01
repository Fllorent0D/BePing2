import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiModule} from './api/api.module';
import {environment} from '../../environments/environment';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {states} from './store';
import {NgxsAsyncStoragePluginModule} from '@ngxs-labs/async-storage-plugin';
import {NgxsStorageService} from './services/store/ngxs-storage.service';
import {SuperTabsModule} from '@ionic-super-tabs/angular';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TabtDatabaseInterceptor} from './interceptors/tabt-database-interceptor.service';
import {TabtCredentialsInterceptor} from './interceptors/tabt-credentials-interceptor.service';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {BepingUserAgentInterceptor} from './interceptors/beping-user-agent.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ApiModule.forRoot({
            rootUrl: environment.tabtUrl,
        }),
        SuperTabsModule.forRoot(),
        NgxsAsyncStoragePluginModule.forRoot(NgxsStorageService),
        NgxsModule.forRoot(
            [], {
                developmentMode: !environment.production,
                selectorOptions: {
                    injectContainerState: false
                }
            }
        ),
        NgxsModule.forFeature(states),
        NgxsLoggerPluginModule.forRoot({
            disabled: environment.production
        }),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production
        }),
        ScrollingModule,
        TranslateModule.forRoot({
            defaultLanguage: 'fr',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        LeafletModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TabtDatabaseInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TabtCredentialsInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BepingUserAgentInterceptor,
            multi: true
        }
    ]
})
export class CoreModule {
}
