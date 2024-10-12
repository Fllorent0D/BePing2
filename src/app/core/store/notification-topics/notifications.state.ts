import {Injectable} from '@angular/core';
import {Action, createSelector, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {NotificationsService} from '../../services/firebase/notifications.service';
import {
    CheckPermissions,
    PermissionStateChanged,
    SubscribeToClub,
    SubscribeToDivision,
    SubscribeToMatch,
    SubscribeToMember,
    SubscribeToTeam,
    SubscribeToTopic,
    SubscriptionToTopicSuccessful,
    UnsubscribeAll,
    UnsubscribeToTopic,
    UnsubscriptionToTopicSuccessful
} from './notifications.actions';
import {PermissionState} from '@capacitor/core';
import {CurrentSeasonChanged} from '../season';
import {UpdateCurrentLang} from '../settings';
import {TranslateService} from '@ngx-translate/core';
import {asyncScheduler, scheduled} from 'rxjs';
import {PLAYER_CATEGORY} from '../../models/user';
import {UserStateModel} from '../user/user.state';
import {AnalyticsService} from '../../services/firebase/analytics.service';

export interface NotificationsStateModel {
    permission: PermissionState | null;
    topics: string[];
}

@State<NotificationsStateModel>({
    name: 'notificationTopic',
    defaults: {
        topics: [],
        permission: null
    }
})
@Injectable({providedIn: 'root'})
export class NotificationsState implements NgxsOnInit {

    @Selector([NotificationsState])
    static topics(state: NotificationsStateModel): string[] {
        return state.topics;
    }

    @Selector([NotificationsState])
    static currentPermission(state: NotificationsStateModel): PermissionState | null {
        return state.permission;
    }
    static isSubscribedToTopic(topic: string) {
        return createSelector([NotificationsState], (notification: NotificationsStateModel) => {
            return notification.topics.indexOf(topic) !== -1;
        });
    }

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly translateService: TranslateService,
    ) {
    }

    async ngxsOnInit(ctx?: StateContext<NotificationsStateModel>) {
        ctx.dispatch(new CheckPermissions());
    }

    @Action([CheckPermissions])
    async checkPermission(ctx: StateContext<NotificationsStateModel>) {
        const state = ctx.getState();

        console.log('checking perms');
        const currentStatus = await this.notificationsService.checkPermissionStatus();

        if (state.permission !== currentStatus) {
            console.log(state.permission, currentStatus);
            ctx.dispatch(new PermissionStateChanged(currentStatus));
        }
    }

    @Action([SubscribeToTopic])
    async subscribeToTopic(ctx: StateContext<NotificationsStateModel>, {topic}: SubscribeToTopic) {
        const permissionsState = await this.notificationsService.requestPermission();

        if (permissionsState === 'granted') {
            const state = ctx.getState();
            const actions = [];
            if (state.topics.every(t => t.indexOf('lang-') === -1) && topic.indexOf('lang-') !== 0) {
                // Try to subscribe to a topic and did not subscribe to a lang channel earlier
                // Second check is to avoid infinite loop
                actions.push(new SubscribeToTopic(NotificationsService.generateTopicForLang(this.translateService.currentLang)));
            }

            const response = await this.notificationsService.subscribeToTopic(topic);
            actions.push(new SubscriptionToTopicSuccessful(topic, response));
            return ctx.dispatch(actions);
        }
        return scheduled([], asyncScheduler);
    }

    @Action([PermissionStateChanged])
    permissionChanged(ctx: StateContext<NotificationsStateModel>, {state}: PermissionStateChanged) {
        const currentState = ctx.getState().permission;
        if (state === 'denied' && currentState !== 'denied') {
            ctx.dispatch(new UnsubscribeAll());
        }

        ctx.patchState({
            permission: state
        });
    }

    @Action([SubscriptionToTopicSuccessful])
    subscribeToTopicSuccessful(ctx: StateContext<NotificationsStateModel>, {topic, message}: SubscriptionToTopicSuccessful) {
        const state = ctx.getState();
        ctx.patchState({
            topics: [...state.topics, topic]
        });
    }

    @Action([SubscribeToMember])
    subscribeToMember(ctx: StateContext<NotificationsStateModel>, {memberEntry}: SubscribeToMember) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForMember(memberEntry.UniqueIndex))
        );
    }

    @Action([UnsubscribeAll])
    unsubscribeAll(ctx: StateContext<NotificationsStateModel>) {
        const topics = ctx.getState().topics;
        ctx.dispatch(topics.map((t) => new UnsubscribeToTopic(t)));
    }

    @Action([SubscribeToTeam])
    subscribeToTeam(ctx: StateContext<NotificationsStateModel>, {teamEntry}: SubscribeToTeam) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForTeam(teamEntry.TeamId))
        );
    }

    @Action([SubscribeToClub])
    subscribeToClub(ctx: StateContext<NotificationsStateModel>, {clubEntry}: SubscribeToClub) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForClub(clubEntry.UniqueIndex))
        );
    }

    @Action([SubscribeToDivision])
    subscribeToDivision(ctx: StateContext<NotificationsStateModel>, {divisionEntry}: SubscribeToDivision) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForDivision(divisionEntry.DivisionId))
        );
    }

    @Action([SubscribeToMatch])
    subscribeToMatch(ctx: StateContext<NotificationsStateModel>, {teamMatchesEntry}: SubscribeToMatch) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForMatch(teamMatchesEntry.MatchUniqueId))
        );
    }

    @Action([UnsubscribeToTopic])
    async unsubscribeToTopic(ctx: StateContext<NotificationsStateModel>, {topic}: UnsubscribeToTopic) {
        const response = await this.notificationsService.unsubscribeToTopic(topic);
        return ctx.dispatch(new UnsubscriptionToTopicSuccessful(topic, response));
    }

    @Action([UnsubscriptionToTopicSuccessful])
    unsubscribeToTopicSuccessful(ctx: StateContext<NotificationsStateModel>, {topic, message}: UnsubscriptionToTopicSuccessful) {
        const state = ctx.getState();
        return ctx.patchState({
            topics: state.topics.filter(t => t !== topic)
        });
    }

    @Action([UpdateCurrentLang])
    reSubscribeToCorrectLang(ctx: StateContext<NotificationsStateModel>, {lang}: UpdateCurrentLang) {
        const state = ctx.getState();
        if (state?.permission !== 'granted') {
            return scheduled([], asyncScheduler);
        }
        const existingTopics = state.topics;

        const actions = [new SubscribeToTopic(NotificationsService.generateTopicForLang(lang))];
        const currentLangTopic = existingTopics.find(topic => topic.indexOf('lang-') === 0);
        if (currentLangTopic) {
            actions.push(new UnsubscribeToTopic(currentLangTopic));
        }
        return ctx.dispatch(actions);
    }

    @Action([CurrentSeasonChanged])
    resetOnNewSeason(ctx: StateContext<NotificationsStateModel>) {
        const actions = [];
        const subscriptions = ctx.getState().topics;

        for (const topic of subscriptions) {
            actions.push(new UnsubscribeToTopic(topic));
        }

        ctx.dispatch(actions);
    }

}
