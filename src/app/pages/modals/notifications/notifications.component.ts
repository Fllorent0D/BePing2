import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {AnalyticsService} from '../../../core/services/firebase/analytics.service';
import {Select, Store} from '@ngxs/store';
import {FavoriteItem, FavoritesState} from '../../../core/store/favorites';
import {Observable} from 'rxjs';
import {NotificationsState} from '../../../core/store/notification-topics/notifications.state';
import {NotificationsService} from '../../../core/services/firebase/notifications.service';
import {map} from 'rxjs/operators';
import {SubscribeToTopic, UnsubscribeToTopic} from '../../../core/store/notification-topics/notifications.actions';
import {TranslateService} from '@ngx-translate/core';

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
    @Select(NotificationsState.topics) topics$: Observable<string[]>;


    constructor(
        private readonly modalCtrl: ModalController,
        private readonly analyticsService: AnalyticsService,
        private readonly notificationsService: NotificationsService,
        private readonly translateService: TranslateService,
        private readonly store: Store
    ) {
    }

    ngOnInit(): void {
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

    }

    async closeModal() {
        this.analyticsService.logEvent('notifications_dismiss');
        await this.modalCtrl.dismiss();
    }
}
