import {Component, Input, OnInit} from '@angular/core';
import {VenueEntry} from '../../../../core/api/models/venue-entry';

@Component({
    selector: 'beping-club-pratical-info-tab',
    templateUrl: './club-pratical-info-tab.component.html',
    styleUrls: ['./club-pratical-info-tab.component.scss']
})
export class ClubPraticalInfoTabComponent implements OnInit {

    @Input() venues: VenueEntry[] = [];

    constructor() {
    }

    ngOnInit() {
    }

}
