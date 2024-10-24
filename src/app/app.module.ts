import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Router, RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy, NavController} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import localFR from '@angular/common/locales/fr';
import localNL from '@angular/common/locales/nl';
import {AnalyticsService} from './core/services/firebase/analytics.service';
import {CrashlyticsService} from './core/services/crashlytics.service';
import {InAppPurchasesService} from './core/services/in-app-purchases.service';
import {Device} from '@capacitor/device';
import {AppStateService} from './core/services/app-state.service';
import {RemoteConfigService} from './core/services/remote-config.service';
import {SplashScreen} from '@capacitor/splash-screen';
import {Store} from '@ngxs/store';
import {DeepLinkService} from './core/services/deep-link.service';
import {isPlatform} from '@ionic/core';
import {FCM} from '@capacitor-community/fcm';
import {PushNotifications} from '@capacitor/push-notifications';
import {NotificationsService} from './core/services/firebase/notifications.service';

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
                crashlytics: CrashlyticsService,
                navCtrl: NavController,
                notificationsService: NotificationsService
            ) => async () => {
                try {
                    const deviceInfo = await Device.getInfo();
                    const initTasks = [
                        appState.init(),
                        deeplink.init(),
                    ];
                    remoteConfig.init();
                    analyticsService.init();
                    iAPService.init();
                    notificationsService.init();

                    await Promise.all(initTasks);
                    console.log('init tasks done');

                    if (deviceInfo.platform !== 'web') {
                        await SplashScreen.hide();
                    }
                    if (isPlatform('tablet')) {
                        await navCtrl.navigateRoot('/side-pane/homeTab/home', {animated: false});
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
                CrashlyticsService,
                NavController,
                NotificationsService
            ],
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
