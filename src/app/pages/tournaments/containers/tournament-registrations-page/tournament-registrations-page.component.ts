import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';
import {RegistrationEntry} from '../../../../core/api/models/registration-entry';

@Component({
    selector: 'beping-tournament-registrations-page',
    templateUrl: './tournament-registrations-page.component.html',
    styleUrls: ['./tournament-registrations-page.component.scss']
})
export class TournamentRegistrationsPageComponent implements OnInit {

    registrations: RegistrationEntry[];

    constructor(
        private readonly location: Location,
        private readonly tabsNavigator: TabsNavigationService
    ) {
    }

    ngOnInit() {
        const {registrations} = this.location.getState() as { registrations: RegistrationEntry[] };
        this.registrations = registrations ?? [];
    }

    registrationClicked(registrationEntry: RegistrationEntry) {
        this.tabsNavigator.navigateTo(['player', registrationEntry.Member.UniqueIndex.toString(10)]);

    }
}
