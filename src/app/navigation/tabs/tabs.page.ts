import {Component} from '@angular/core';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    selectedTab: string;

    constructor() {
    }

    tabChanged({tab}: { tab: string }) {
        this.selectedTab = tab;
    }
}
