import {Component, OnInit} from '@angular/core';
import {TabsNavigationService} from '../../core/services/navigation/tabs-navigation.service';

@Component({
    selector: 'beping-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss']
})
export class MatchesPage implements OnInit {

    isloading: boolean;

    constructor(
        private readonly tabsNavigationService: TabsNavigationService
    ) {
    }

    ngOnInit() {
    }

    navigateToClub(index) {
        this.tabsNavigationService.navigateTo(['clubs', index]);
    }


    test(event: CustomEvent<any>) {
        console.log(event)
    }
}
