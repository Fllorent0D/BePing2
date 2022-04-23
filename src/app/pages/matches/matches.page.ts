import {Component, OnInit} from '@angular/core';
import {TabsNavigationService} from '../../core/services/navigation/tabs-navigation.service';
import {FavoriteItem, FavoritesState} from '../../core/store/favorites';
import {combineLatest, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {filter, map, take} from 'rxjs/operators';
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

    @Select(FavoritesState.favoriteClubs) favoritesClub: Observable<FavoriteItem<string>[]>;
    @Select(FavoritesState.favoriteMembers) favoritesMember: Observable<FavoriteItem<number>[]>;
    @Select(FavoritesState.favoriteDivision) favoritesDivision: Observable<FavoriteItem<number>[]>;
    @Select(FavoritesState.favoriteTeams) favoritesTeam: Observable<FavoriteItem<string>[]>;

    @Select(UserState.getMemberClub) memberClub: Observable<ClubEntry | void>;

    @Select(NotificationsState.topics) topics$: Observable<string[]>;
    @Select(RemoteSettingsState.notificationsEnabled) notifications$: Observable<boolean>;
    hasFavorites$: Observable<boolean>;

    constructor(
        private readonly tabsNavigationService: TabsNavigationService,
        private readonly dialogService: DialogService,
        private readonly routerOutlet: IonRouterOutlet,
        private readonly isPro: IsProService,
        private readonly store: Store
    ) {
    }

    ngOnInit() {
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
        this.isPro.isPro$(this.routerOutlet.nativeEl).pipe(
            take(1),
            filter((isPro) => isPro)
        ).subscribe(isPro => {
            this.dialogService.showModal({
                component: ModalBaseComponent,
                componentProps: {
                    rootPage: NotificationsComponent
                },
                presentingElement: this.routerOutlet.nativeEl,
                swipeToClose: true
            });
        });
    }
}
