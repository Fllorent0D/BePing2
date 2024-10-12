import {Component, OnInit} from '@angular/core';
import {TabsNavigationService} from '../../core/services/navigation/tabs-navigation.service';
import {
    FavoriteItem,
    FavoritesState,
    ToggleClubFromFavorites,
    ToggleDivisionFromFavorites,
    ToggleMemberFromFavorites,
    ToggleTeamsFromFavorites
} from '../../core/store/favorites';
import {combineLatest, Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {UserState} from '../../core/store/user/user.state';
import {ClubEntry} from '../../core/api/models/club-entry';
import {NotificationsState} from '../../core/store/notification-topics/notifications.state';
import {IonRouterOutlet} from '@ionic/angular';
import {NotificationsComponent} from '../modals/notifications/notifications.component';
import {ModalBaseComponent} from '../modals/modal-base/modal-base.component';
import {DialogService} from '../../core/services/dialog-service.service';
import {RemoteSettingsState} from '../../core/store/remote-settings';
import {IsProService} from '../../core/services/is-pro.service';

@Component({
    selector: 'beping-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss']
})
export class MatchesPage implements OnInit {

    favoritesClub: Observable<FavoriteItem<string>[]>;
    favoritesMember: Observable<FavoriteItem<number>[]>;
    favoritesDivision: Observable<FavoriteItem<number>[]>;
    favoritesTeam: Observable<FavoriteItem<string>[]>;
    memberClub: Observable<ClubEntry | void>;
    topics$: Observable<string[]>;
    notifications$: Observable<boolean>;
    hasFavorites$: Observable<boolean>;
    clubName$: Observable<string>;

    constructor(
        private readonly tabsNavigationService: TabsNavigationService,
        private readonly dialogService: DialogService,
        private readonly routerOutlet: IonRouterOutlet,
        private readonly isPro: IsProService,
        private readonly store: Store
    ) {
    }

    ngOnInit() {
        this.favoritesClub = this.store.select(FavoritesState.favoriteClubs);
        this.favoritesMember = this.store.select(FavoritesState.favoriteMembers);
        this.favoritesDivision = this.store.select(FavoritesState.favoriteDivision);
        this.favoritesTeam = this.store.select(FavoritesState.favoriteTeams);
        this.memberClub = this.store.select(UserState.getMemberClub);
        this.topics$ = this.store.select(NotificationsState.topics);
        this.notifications$ = this.store.select(RemoteSettingsState.notificationsEnabled);
        this.hasFavorites$ = combineLatest([
            this.favoritesMember,
            this.favoritesDivision,
            this.favoritesClub,
            this.favoritesTeam
        ]).pipe(
            map(([
                     members,
                     division,
                     clubs,
                     teams]) => members.length > 0 || division.length > 0 || clubs.length > 0 || teams.length > 0)
        );
    }

    navigateToURI(uri: string[]) {
        this.tabsNavigationService.navigateTo(uri);
    }

    async openNotificationsModal() {
        this.dialogService.showModal({
            component: ModalBaseComponent,
            componentProps: {
                rootPage: NotificationsComponent
            },
            presentingElement: this.routerOutlet.nativeEl,
            canDismiss: true
        });
    }

    addCurrentClubToFavorite(): void {
        this.memberClub.pipe(
            take(1),
            switchMap((club: ClubEntry) => this.store.dispatch(new ToggleClubFromFavorites({
                uniqueIndex: club.UniqueIndex,
                uri: ['clubs', club.UniqueIndex],
                note: club.LongName,
                label: club.UniqueIndex
            } as FavoriteItem<string>)))
        ).subscribe();
    }

    deleteFromFavorite(item: FavoriteItem<any>, type: 'club' | 'division' | 'member' | 'team') {
        switch (type) {
            case 'member':
                this.store.dispatch(new ToggleMemberFromFavorites(item));
                break;
            case 'division':
                this.store.dispatch(new ToggleDivisionFromFavorites(item));
                break;
            case 'club':
                this.store.dispatch(new ToggleClubFromFavorites(item));
                break;
            case 'team':
                this.store.dispatch(new ToggleTeamsFromFavorites(item));
                break;
        }

    }
}
