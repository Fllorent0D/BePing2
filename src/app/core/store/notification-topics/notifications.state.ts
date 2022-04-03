import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Selector, State, StateContext} from '@ngxs/store';
import {NotificationsService} from '../../services/firebase/notifications.service';
import {
    PermissionStateChanged,
    SubscribeToClub,
    SubscribeToDivision,
    SubscribeToMatch,
    SubscribeToMember,
    SubscribeToTeam,
    SubscribeToTopic,
    SubscriptionToTopicSuccessful,
    UnsubscribeToTopic,
    UnsubscriptionToTopicSuccessful
} from './notifications.actions';
import {PermissionState} from '@capacitor/core';
import {CurrentSeasonChanged} from '../season';

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
        private readonly notificationsService: NotificationsService
    ) {
    }

    async ngxsOnInit(ctx?: StateContext<NotificationsStateModel>) {
        const state = ctx.getState();
        const currentStatus = await this.notificationsService.checkPermissionStatus();

        if (state.permission !== currentStatus) {
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
        ctx.dispatch(new SubscribeToTopic(NotificationsService.generateTopicForMember(memberEntry.UniqueIndex)));
    }

    @Action([SubscribeToTeam])
    subscribeToTeam(ctx: StateContext<NotificationsStateModel>, {teamEntry}: SubscribeToTeam) {
        ctx.dispatch(new SubscribeToTopic(NotificationsService.generateTopicForTeam(teamEntry.TeamId)));
    }

    @Action([SubscribeToClub])
    subscribeToClub(ctx: StateContext<NotificationsStateModel>, {clubEntry}: SubscribeToClub) {
        ctx.dispatch(new SubscribeToTopic(NotificationsService.generateTopicForClub(clubEntry.UniqueIndex)));
    }

    @Action([SubscribeToDivision])
    subscribeToDivision(ctx: StateContext<NotificationsStateModel>, {divisionEntry}: SubscribeToDivision) {
        ctx.dispatch(new SubscribeToTopic(NotificationsService.generateTopicForDivision(divisionEntry.DivisionId)));
    }

    @Action([SubscribeToMatch])
    subscribeToMatch(ctx: StateContext<NotificationsStateModel>, {teamMatchesEntry}: SubscribeToMatch) {
        ctx.dispatch(new SubscribeToTopic(NotificationsService.generateTopicForMatch(teamMatchesEntry.MatchUniqueId)));
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
