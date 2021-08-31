import {Component, OnInit} from '@angular/core';
import {HapticsService} from '../core/services/haptics.service';

@Component({
    selector: 'beping-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

    selectedTab: string;

    constructor(
        private readonly haptics: HapticsService
    ) {
    }

    ngOnInit() {

    }

    tabChanged({tab}: { tab: string }) {
        this.haptics.hapticsImpact();
        this.selectedTab = tab;
    }
}
