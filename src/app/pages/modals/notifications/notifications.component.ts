import {Component, OnInit} from '@angular/core';
import {IonRouterOutlet, ModalController} from '@ionic/angular';
import {AnalyticsService} from '../../../core/services/firebase/analytics.service';
import {Store} from '@ngxs/store';
import {FavoriteItem, FavoritesState} from '../../../core/store/favorites';
import {Observable} from 'rxjs';
import {NotificationsState} from '../../../core/store/notification-topics/notifications.state';
import {NotificationsService} from '../../../core/services/firebase/notifications.service';
import {map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {NativeSettingsService} from '../../../core/services/native-settings.service';

export interface FavoriteWithTopic extends FavoriteItem<string | number> {
    topic: string;
}

@Component({
    selector: 'beping-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    clubsTopics$: Observable<FavoriteWithTopic[]>;
    clubTeamsTopics$: Observable<FavoriteWithTopic[]>;
    membersTopics$: Observable<FavoriteWithTopic[]>;
    divisionsTopics$: Observable<FavoriteWithTopic[]>;
    matchesTopics$: Observable<FavoriteWithTopic[]>;
    topics$: Observable<string[]>;

    notificationsPermIsDenied$: Observable<boolean>;

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly analyticsService: AnalyticsService,
        private readonly notificationsService: NotificationsService,
        private readonly translateService: TranslateService,
        private readonly store: Store,
        private readonly nativeSettingsService: NativeSettingsService,
    ) {
    }

    ngOnInit(): void {
        this.topics$ = this.store.select(NotificationsState.topics);
        this.clubsTopics$ = this.store.select(FavoritesState.favoriteClubs).pipe(
            map((favs) => favs.map(fav => ({
                ...fav,
                topic: NotificationsService.generateTopicForClub(fav.uniqueIndex)
            })))
        );
        this.clubTeamsTopics$ = this.store.select(FavoritesState.favoriteTeams).pipe(
            map((favs) => favs.map(fav => ({
                ...fav,
                topic: NotificationsService.generateTopicForTeam(fav.uniqueIndex)
            })))
        );
        this.membersTopics$ = this.store.select(FavoritesState.favoriteMembers).pipe(
            map((favs) => favs.map(fav => ({
                ...fav,
                topic: NotificationsService.generateTopicForMember(fav.uniqueIndex)
            })))
        );
        this.divisionsTopics$ = this.store.select(FavoritesState.favoriteDivision).pipe(
            map((favs) => favs.map(fav => ({
                ...fav,
                topic: NotificationsService.generateTopicForDivision(fav.uniqueIndex)
            })))
        );
        this.notificationsPermIsDenied$ = this.store.select(NotificationsState.currentPermission).pipe(
            map((permission) => permission === 'denied')
        );
    }

    async closeModal() {
        this.analyticsService.logEvent('notifications_dismiss');
        await this.modalCtrl.dismiss();
    }

    openSettings() {
        this.nativeSettingsService.openNativeSettings();
    }
}
