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
    static generateTopicForClub(clubUniqueIndex: string, lang: string): string {
        return `club-${clubUniqueIndex}-${lang}`;
    }

    static generateTopicForMember(memberUniqueIndex: number, lang: string): string {
        return `member-${memberUniqueIndex.toString(10)}-${lang}`;
    }

    static generateTopicForTeam(teamId: string, lang: string): string {
        return `team-${teamId}-${lang}`;
    }

    static generateTopicForDivision(divisionId: number, lang: string): string {
        return `division-${divisionId.toString(10)}-${lang}`;
    }

    static generateTopicForMatch(matchId: number, lang: string): string {
        return `match-${matchId.toString(10)}-${lang}`;
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
        await dialog.onWillDismiss();
    }

    async requestPermission(): Promise<PermissionState> {
        console.log('request perms');

        const currentPerm = await this.checkPermissionStatus();
        if (currentPerm === 'denied') {
            await this.showAlertToAcceptNotifications();
            throw new Error('Notifications denied');
        }
        if (['prompt-with-rationale', 'prompt'].includes(currentPerm)) {
            let shouldStop = false;
            const alert = await this.dialogService.showAlert({
                header: 'NOTIFICATIONS.TURN_ON',
                message: 'NOTIFICATIONS.PLEASE_TURN_ON',
                buttons: [
                    {
                        text: 'COMMON.CANCEL',
                        role: 'cancel',
                        handler: () => {
                            shouldStop = true;
                        }
                    },
                    {
                        text: 'NOTIFICATIONS.ALLOW',
                        handler: () => {
                            shouldStop = false;
                        }
                    }
                ]
            });
            await alert.onWillDismiss();
            console.log('show alert passed');
            // Yea...
            if (shouldStop) {
                throw new Error('Stopping flow');
                return currentPerm;
            }
        }

        const response = await PushNotifications.requestPermissions();
        if (response.receive === 'granted') {
            console.log('perms granted');

            await PushNotifications.register();
        }
        return response.receive;
    }

    async checkPermissionStatus(): Promise<PermissionState> {
        const response = await PushNotifications.checkPermissions();
        return response.receive;
    }

}
