import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {Platform} from '@ionic/angular';
import {AdOptions, AdSize} from '@capacitor-community/admob';

const {AdMob, Device} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class AdsService {
    private eventOnAdSize;
    private appMargin: number;
    constructor(
        private platform: Platform
    ) {
        this.initFb();
    }

    async initFb() {
        AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: []
        });
    }

    interstitialAd() {
        const options: AdOptions = {
            isTesting: true,
            adId: this.platform.is('ios') ? 'ca-app-pub-7688354648101560/8969525896' : ' '
        };
        AdMob.prepareInterstitial(options);

        // Subscribe Banner Event Listener
        AdMob.addListener('onInterstitialAdLoaded', (info: boolean) => {
            // You can call showInterstitial() here or anytime you want.
            console.log('Interstitial Ad Loaded');
            AdMob.showInterstitial();
        });
    }

    showBanner() {
        const options: AdOptions = {
            adId: 'ca-app-pub-7688354648101560/9248727497',
            adSize: AdSize.FLUID,
            margin: 0,
            isTesting: true,
            // npa: true
        };
        AdMob.showBanner(options);

        this.eventOnAdSize = AdMob.addListener('onAdSize', (info: any) => {
            this.appMargin = parseInt(info.height, 10);
            if (this.appMargin > 0) {
                const app: HTMLElement = document.querySelector('ion-router-outlet');
                app.style.marginBottom = this.appMargin + 'px';
            }
        });
    }

}
