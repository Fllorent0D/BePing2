import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
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

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly translateService: TranslateService
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
            const response = await this.notificationsService.subscribeToTopic(topic);
            ctx.dispatch(new SubscriptionToTopicSuccessful(topic, response));
        }
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
            new SubscribeToTopic(NotificationsService.generateTopicForMember(memberEntry.UniqueIndex, this.translateService.currentLang))
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
            new SubscribeToTopic(NotificationsService.generateTopicForTeam(teamEntry.TeamId, this.translateService.currentLang))
        );
    }

    @Action([SubscribeToClub])
    subscribeToClub(ctx: StateContext<NotificationsStateModel>, {clubEntry}: SubscribeToClub) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForClub(clubEntry.UniqueIndex, this.translateService.currentLang))
        );
    }

    @Action([SubscribeToDivision])
    subscribeToDivision(ctx: StateContext<NotificationsStateModel>, {divisionEntry}: SubscribeToDivision) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForDivision(divisionEntry.DivisionId, this.translateService.currentLang))
        );
    }

    @Action([SubscribeToMatch])
    subscribeToMatch(ctx: StateContext<NotificationsStateModel>, {teamMatchesEntry}: SubscribeToMatch) {
        ctx.dispatch(
            new SubscribeToTopic(NotificationsService.generateTopicForMatch(teamMatchesEntry.MatchUniqueId, this.translateService.currentLang))
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
        const existingTopics = ctx.getState().topics;
        const actions: (UnsubscribeToTopic | SubscribeToTopic)[] = [];
        // unsubscribe all current topic of old lang
        actions.push(...existingTopics.map(topic => new UnsubscribeToTopic(topic)));

        // resubscribe to the correct lang
        actions.push(...existingTopics
            .map(topic => {
                const topicParts = topic.split('-');
                topicParts[topicParts.length - 1] = lang;
                return topicParts.join('-');
            })
            .map((t) => new SubscribeToTopic(t))
        );
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
