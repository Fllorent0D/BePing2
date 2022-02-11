import {Component} from '@angular/core';
import '@capacitor-community/firebase-analytics';
import {Store} from '@ngxs/store';

@Component({
    selector: 'beping-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
        private readonly state: Store,
    ) {
    }

}
