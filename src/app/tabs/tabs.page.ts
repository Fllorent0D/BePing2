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
export class TabsPage implements OnInit {

    selectedTab: string;

    constructor(
        private readonly haptics: HapticsService,
        private readonly router: Router,
        private readonly navCtrl: NavController
    ) {
    }

    ngOnInit() {
        if (isPlatform('tablet')) {
            this.navCtrl.navigateRoot('/side-pane/homeTab/home', {animated: false});
        }
    }

    tabChanged({tab}: { tab: string }) {
        this.haptics.hapticsImpact();
        this.selectedTab = tab;
    }
}
