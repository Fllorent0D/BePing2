import {Component, Input, OnInit} from '@angular/core';
import {VenueEntry} from '../../../../core/api/models/venue-entry';
import {StartNavigationService} from '../../../../core/services/start-navigation.service';

@Component({
    selector: 'beping-club-pratical-info-tab',
    templateUrl: './club-pratical-info-tab.component.html',
    styleUrls: ['./club-pratical-info-tab.component.scss']
})
export class ClubPraticalInfoTabComponent implements OnInit {

    @Input() venues: VenueEntry[] = [];

    constructor(
        private readonly navigateService: StartNavigationService
    ) {
    }

    ngOnInit() {
    }

    navigateToVenue(venue: VenueEntry) {
        this.navigateService.navigateToVenue(venue);
    }
}
