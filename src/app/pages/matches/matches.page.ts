import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TabsNavigationService} from '../../core/services/navigation/tabs-navigation.service';
import {FavoriteItem, FavoritesState} from '../../core/store/favorites';
import {combineLatest, Observable} from 'rxjs';
import {Select} from '@ngxs/store';
import {map} from 'rxjs/operators';
import {UserState} from '../../core/store/user/user.state';
import {ClubEntry} from '../../core/api/models/club-entry';

@Component({
    selector: 'beping-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss']
})
export class MatchesPage implements OnInit {

    @Select(FavoritesState.favoriteClubs) favoritesClub: Observable<FavoriteItem<string>[]>;
    @Select(FavoritesState.favoriteMembers) favoritesMember: Observable<FavoriteItem<number>[]>;
    @Select(FavoritesState.favoriteDivision) favoritesDivision: Observable<FavoriteItem<number>[]>;
    @Select(FavoritesState.favoriteTeams) favoritesTeam: Observable<FavoriteItem<string>[]>;

    @Select(UserState.getMemberClub) memberClub: Observable<ClubEntry | void>;
    hasFavorites$: Observable<boolean>;

    constructor(
        private readonly tabsNavigationService: TabsNavigationService,
    ) {
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

    navigateToURI(uri: string[]) {
        this.tabsNavigationService.navigateTo(uri);
    }

}
