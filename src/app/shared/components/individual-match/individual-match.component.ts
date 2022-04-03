import {Component, Input, OnInit} from '@angular/core';
import {MemberEntryResultEntry} from '../../../core/api/models/member-entry-result-entry';
import {TabsNavigationService} from '../../../core/services/navigation/tabs-navigation.service';

@Component({
    selector: 'beping-individual-match',
    templateUrl: './individual-match.component.html',
    styleUrls: ['./individual-match.component.scss']
})
export class IndividualMatchComponent implements OnInit {

    @Input() result?: MemberEntryResultEntry = null;

    constructor(
        private readonly tabNavigation: TabsNavigationService
    ) {
    }

    ngOnInit() {
    }

    navigateToDetails() {
        this.tabNavigation.navigateTo(['player', this.result?.UniqueIndex.toString(10)]);
    }
}
