import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {TournamentSerieEntry} from '../../../../core/api/models/tournament-serie-entry';
import {TabsNavigationService} from '../../../../core/services/navigation/tabs-navigation.service';

@Component({
    selector: 'beping-tournament-series-details',
    templateUrl: './tournament-series-details.component.html',
    styleUrls: ['./tournament-series-details.component.scss']
})
export class TournamentSeriesDetailsComponent implements OnInit {

    series: TournamentSerieEntry[];

    constructor(
        private readonly location: Location,
        private readonly tabsNavigator: TabsNavigationService
    ) {
    }

    ngOnInit() {
        const {series} = this.location.getState() as { series: TournamentSerieEntry[] };
        this.series = series ?? [];
    }

    serieClicked(serie: TournamentSerieEntry) {
        if (serie.RegistrationCount === 0) {
            return;
        }

        const url = this.location.path().split('/');
        url.splice(0, 3);
        url.push('registrations', serie.UniqueIndex.toString(10));
        this.tabsNavigator.navigateTo(url, {state: {registrations: serie.RegistrationEntries}});
    }
}
