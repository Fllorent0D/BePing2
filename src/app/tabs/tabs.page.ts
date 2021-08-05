import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'beping-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

    selectedTab: string;

    constructor(
    ) {
    }

    ngOnInit() {

    }

    tabChanged({tab}: { tab: string }) {
        console.log(this.selectedTab);
        this.selectedTab = tab;
    }
}
