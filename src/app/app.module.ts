import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {registerLocaleData} from '@angular/common';
import localFR from '@angular/common/locales/fr';
import localNL from '@angular/common/locales/nl';
import {GlobalErrorHandlerService} from './core/services/gloabel-error-handler.service';
import {AnalyticsService} from './core/services/firebase/analytics.service';
import {StorageService} from './core/services/store/storage.service';
import {NgxsAsyncStoragePluginModule} from '@ngxs-labs/async-storage-plugin';
import {NgxsStorageService} from './core/services/store/ngxs-storage.service';
import {NgxsModule} from '@ngxs/store';
import {environment} from '../environments/environment';
import {SeasonState} from './core/store/season';

registerLocaleData(localFR);
registerLocaleData(localNL);

@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),

        AppRoutingModule,
        CoreModule,
        ScrollingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
        {
            provide: APP_INITIALIZER,
            useFactory: (
                analyticsService: AnalyticsService,
                storageService: StorageService,
                seasonState: SeasonState) =>
                () => Promise.all([analyticsService.initFb()]),
            deps: [AnalyticsService, StorageService, SeasonState],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
