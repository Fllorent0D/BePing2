import {Component, OnInit, Input} from '@angular/core';
import {ClubsService} from '../core/api/services/clubs.service';
import {Plugins} from '@capacitor/core';
import {FirebaseAnalytics} from '@capacitor-community/firebase-analytics';

const {FirebaseCrashlytics} = Plugins;

@Component({
    selector: 'beping-explore-container',
    templateUrl: './explore-container.component.html',
    styleUrls: ['./explore-container.component.scss']
})
export class ExploreContainerComponent implements OnInit {
    @Input() name: string;

    constructor(
        private readonly clubService: ClubsService
    ) {
    }

    crashTheApp() {
        FirebaseCrashlytics.recordException({
            message: 'This is a non-fatal message'
        });
        // FirebaseCrashlytics.crash({message: 'Awesome error message'});
    }

    sendEvent() {
        FirebaseAnalytics.logEvent({
            name: 'select_content',
            params: {
                content_type: 'image',
                content_id: 'P12453',
                items: [{name: 'Kittens'}]
            }
        });

    }

    ngOnInit() {
        this.clubService.findClubById({
            clubIndex: 'L360'
        }).subscribe((response) => {
            console.log(response);
        });

    }

}
