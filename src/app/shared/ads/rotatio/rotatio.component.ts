import {Component} from '@angular/core';
import {InAppBrowserService} from '../../../core/services/browser/in-app-browser.service';
import {AnalyticsService} from '../../../core/services/firebase/analytics.service';

@Component({
    selector: 'beping-rotatio',
    templateUrl: './rotatio.component.html',
    styleUrls: ['./rotatio.component.css']
})
export class RotatioComponent {

    constructor(
        private readonly inAppBrowser: InAppBrowserService,
        private readonly analytics: AnalyticsService
    ) {
    }

    openRotatio() {
        this.inAppBrowser.openRotatio();
    }

}
