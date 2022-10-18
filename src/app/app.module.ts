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
import {AppStateService} from './core/services/app-state.service';
import {RemoteConfigService} from './core/services/remote-config.service';
import {SplashScreen} from '@capacitor/splash-screen';
import {Store} from '@ngxs/store';
import {DeepLinkService} from './core/services/deep-link.service';

registerLocaleData(localFR);
registerLocaleData(localNL);

@NgModule({
    declarations: [
        AppComponent
    ],
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
                iAPService: InAppPurchasesService,
                appState: AppStateService,
                store: Store,
                deeplink: DeepLinkService,
                remoteConfig: RemoteConfigService,
                crashlytics: CrashlyticsService
            ) => async () => {
                try {
                    const deviceInfo = await Device.getInfo();
                    const initTasks = [
                        analyticsService.init(),
                        appState.init(),
                        deeplink.init(),
                        remoteConfig.init()
                    ];
                    if (deviceInfo.platform !== 'web') {
                        initTasks.push(iAPService.init());
                    }

                    await Promise.all(initTasks);
                    console.log('init tasks done');

                    if (deviceInfo.platform !== 'web') {
                        await SplashScreen.hide();
                    }
                } catch (e) {
                    console.error('Error during bootstrap:::', e);
                    await crashlytics.recordException(`Unable to run bootstrap tasks`, e);
                }
            },
            deps: [
                AnalyticsService,
                InAppPurchasesService,
                AppStateService,
                Store,
                DeepLinkService,
                RemoteConfigService,
                CrashlyticsService
            ],
            multi: true
        },
        InAppPurchase2,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
