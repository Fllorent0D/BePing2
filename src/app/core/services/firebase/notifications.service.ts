import {Injectable} from '@angular/core';
import {FCM} from '@capacitor-community/fcm';
import {PushNotifications} from '@capacitor/push-notifications';
import {PermissionState} from '@capacitor/core';
import {DialogService} from '../dialog-service.service';
import {Device} from '@capacitor/device';
import {AndroidSettings, IOSSettings, NativeSettings} from 'capacitor-native-settings';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    static generateTopicForClub(clubUniqueIndex: string): string {
        return `club-${clubUniqueIndex}`;
    }

    static generateTopicForMember(memberUniqueIndex: number): string {
        return `member-${memberUniqueIndex.toString(10)}`;
    }

    static generateTopicForTeam(teamId: string): string {
        return `team-${teamId}`;
    }

    static generateTopicForDivision(divisionId: number): string {
        return `division-${divisionId.toString(10)}`;
    }

    static generateTopicForMatch(matchId: number): string {
        return `match-${matchId.toString(10)}`;
    }

    constructor(
        private readonly dialogService: DialogService
    ) {
    }

    async subscribeToTopic(topic: string): Promise<string> {
        const response = await FCM.subscribeTo({topic});
        return response.message;
    }

    async unsubscribeToTopic(topic: string): Promise<string> {
        const response = await FCM.unsubscribeFrom({topic});
        return response.message;
    }

    async showAlertToAcceptNotifications(): Promise<void> {
        const platform = await Device.getInfo();
        const dialog = await this.dialogService.showAlert({
            header: 'NOTIFICATIONS.TURN_ON_NOTIFICATION',
            message: 'NOTIFICATIONS.NOTIFICATION_ARE_OFF_PLEASE_TURN_ON',
            buttons: [
                {
                    id: 'not-now-notifications',
                    role: 'cancel',
                    text: 'NOTIFICATIONS.NOT_NOW',
                },
                {
                    id: 'open-settings',
                    text: 'NOTIFICATIONS.OPEN_SETTINGS',
                    handler: () => {
                        if (platform.platform === 'ios') {
                            NativeSettings.openIOS({option: IOSSettings.App});
                        } else if (platform.platform === 'android') {
                            NativeSettings.openAndroid({option: AndroidSettings.Application});
                        }
                    }
                },
            ]
        });
    }

    async requestPermission(): Promise<PermissionState> {
        const currentPerm = await this.checkPermissionStatus();
        if (currentPerm === 'denied') {
            await this.showAlertToAcceptNotifications();
            return currentPerm;
        }
        if (['prompt-with-rationale', 'prompt'].includes(currentPerm)) {
            let shouldStop = false;
            await this.dialogService.showAlert({
                header: 'NOTIFICATIONS.TURN_ON',
                message: 'NOTIFICATIONS.PLEASE_TURN_ON',
                buttons: [
                    {
                        text: 'COMMON.CANCEL',
                        role: 'cancel'
                    },
                    {
                        text: 'NOTIFICATIONS.ALLOW',
                        handler: () => {
                            shouldStop = true;
                        }
                    }
                ]
            });
            // Yea...
            if (shouldStop) {
                return currentPerm;
            }
        }

        const response = await PushNotifications.requestPermissions();
        if (response.receive === 'granted') {
            await PushNotifications.register();
        }
        return response.receive;
    }

    async checkPermissionStatus(): Promise<PermissionState> {
        const response = await PushNotifications.checkPermissions();
        return response.receive;
    }

}
