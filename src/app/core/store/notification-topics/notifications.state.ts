import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext} from '@ngxs/store';
import {NotificationsService} from '../../services/firebase/notifications.service';
import {
    PermissionStateChanged,
    SubscribeToClub,
    SubscribeToDivision,
    SubscribeToMatch,
    SubscribeToMember,
    SubscribeToTeam,
    SubscribeToTopic,
    SubscriptionToTopicSuccessful
} from './notifications.actions';
import {PermissionState} from '@capacitor/core';

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
        ctx.dispatch(new SubscribeToTopic(`member-${memberEntry.UniqueIndex}`));
    }

    @Action([SubscribeToTeam])
    subscribeToTeam(ctx: StateContext<NotificationsStateModel>, {teamEntry}: SubscribeToTeam) {
        ctx.dispatch(new SubscribeToTopic(`team-${teamEntry.TeamId}`));
    }

    @Action([SubscribeToClub])
    subscribeToClub(ctx: StateContext<NotificationsStateModel>, {clubEntry}: SubscribeToClub) {
        ctx.dispatch(new SubscribeToTopic(`club-${clubEntry.UniqueIndex}`));
    }

    @Action([SubscribeToDivision])
    subscribeToDivision(ctx: StateContext<NotificationsStateModel>, {divisionEntry}: SubscribeToDivision) {
        ctx.dispatch(new SubscribeToTopic(`division-${divisionEntry.DivisionId}`));
    }

    @Action([SubscribeToMatch])
    subscribeToMatch(ctx: StateContext<NotificationsStateModel>, {teamMatchesEntry}: SubscribeToMatch) {
        ctx.dispatch(new SubscribeToTopic(`match-${teamMatchesEntry.MatchId}`));
    }

}
