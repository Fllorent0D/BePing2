import {Component, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';

const {FirebaseAnalytics} = Plugins;

@Component({
    selector: 'beping-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    constructor() {
    }

    ngOnInit() {
        FirebaseAnalytics.setScreenName({
            screenName: 'tab2'
        });
    }
}
