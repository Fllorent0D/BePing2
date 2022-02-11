import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {registerLocaleData} from '@angular/common';
import localFR from '@angular/common/locales/fr';
import localNL from '@angular/common/locales/nl';
import {AnalyticsService} from './core/services/firebase/analytics.service';
import {CrashlyticsService} from './core/services/crashlytics.service';
import {InAppPurchase2} from '@ionic-native/in-app-purchase-2/ngx';
import {InAppPurchasesService} from './core/services/in-app-purchases.service';
import {Device} from '@capacitor/device';

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
        ScrollingModule,
    ],
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        // {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
        {
            provide: APP_INITIALIZER,
            useFactory: (
                analyticsService: AnalyticsService,
                crashlytics: CrashlyticsService,
                iAPService: InAppPurchasesService
            ) => async () => {
                const deviceInfo = await Device.getInfo();
                const initTasks = [
                    analyticsService.initFb(),
                    crashlytics.init(),
                ];
                if (deviceInfo.platform !== 'web') {
                    initTasks.push(iAPService.init());
                }
                await Promise.all(initTasks);
            },
            deps: [AnalyticsService, CrashlyticsService, InAppPurchasesService],
            multi: true
        },
        InAppPurchase2,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
