import {Component, OnInit} from '@angular/core';
import {HapticsService} from '../core/services/haptics.service';
import {isPlatform} from '@ionic/core';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'beping-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    selectedTab: string;

    constructor(
        private readonly haptics: HapticsService,
        private readonly router: Router,
        private readonly navCtrl: NavController
    ) {
    }

    tabChanged({tab}: { tab: string }) {
        this.haptics.hapticsImpact();
        this.selectedTab = tab;
    }
}
