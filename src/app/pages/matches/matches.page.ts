import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TabsNavigationService} from '../../core/services/navigation/tabs-navigation.service';
import {FavoriteItem, FavoritesState} from '../../core/store/favorites';
import {combineLatest, Observable} from 'rxjs';
import {Select} from '@ngxs/store';
import {map} from 'rxjs/operators';

@Component({
    selector: 'beping-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss']
})
export class MatchesPage implements OnInit {

    @Select(FavoritesState.favoriteClubs) favoritesClub: Observable<FavoriteItem<string>[]>;
    @Select(FavoritesState.favoriteMembers) favoritesMember: Observable<FavoriteItem<number>[]>;
    @Select(FavoritesState.favoriteDivision) favoritesDivision: Observable<FavoriteItem<number>[]>;

    hasFavorites$: Observable<boolean>;

    constructor(
        private readonly tabsNavigationService: TabsNavigationService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        // super(changeDetectorRef);
    }

    ngOnInit() {
        this.hasFavorites$ = combineLatest([
            this.favoritesMember,
            this.favoritesDivision,
            this.favoritesClub
        ]).pipe(
            map(([members, division, clubs]) => members.length > 0 || division.length > 0 || clubs.length > 0)
        );
    }

    navigateToClub(index: string) {
        this.tabsNavigationService.navigateTo(['clubs', index]);
    }

    navigateToMember(index: number) {
        this.tabsNavigationService.navigateTo(['player', index.toString(10)]);
    }

    navigateToDivisions(index: number) {
        this.tabsNavigationService.navigateTo(['divisions', index.toString(10)]);
    }


    test(event: CustomEvent<any>) {
        console.log(event);
    }
}
