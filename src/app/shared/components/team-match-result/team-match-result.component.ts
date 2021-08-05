import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TeamMatchesEntry} from '../../../core/api/models/team-matches-entry';
import {TabsNavigationService} from '../../../core/services/navigation/tabs-navigation.service';

@Component({
    selector: 'beping-team-match-result',
    templateUrl: './team-match-result.component.html',
    styleUrls: ['./team-match-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamMatchResultComponent implements OnInit {

    @Input() match: TeamMatchesEntry;

    constructor(
        private readonly tabNavigation: TabsNavigationService
    ) {
    }

    ngOnInit() {
    }

    get isHomeFF(): boolean {
        return this.match.IsHomeForfeited && !this.isAwayFG;
    }

    get isAwayFF(): boolean {
        return this.match.IsAwayForfeited && !this.isHomeFG;
    }

    get isHomeFG(): boolean {
        return this.match.IsHomeWithdrawn;
    }

    get isAwayFG(): boolean {
        return this.match.IsAwayWithdrawn;
    }


    navigateToDetails() {
        this.tabNavigation.navigateTo(['team-match-details', this.match.MatchUniqueId.toString()]);
    }
}
