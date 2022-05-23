import {Injectable} from '@angular/core';
import {FCM} from '@capacitor-community/fcm';
import {PushNotifications} from '@capacitor/push-notifications';
import {PermissionState} from '@capacitor/core';
import {DialogService} from '../dialog-service.service';
import {NativeSettingsService} from '../native-settings.service';
import {TranslateService} from '@ngx-translate/core';

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

    static generateTopicForLang(lang: string): string {
        return `lang-${lang}`;
    }

    constructor(
        private readonly dialogService: DialogService,
        private readonly translate: TranslateService,
        private readonly nativeSettingsService: NativeSettingsService
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
        const dialog = await this.dialogService.showAlert({
            header: this.translate.instant('NOTIFICATIONS.TURN_ON_NOTIFICATION'),
            message: this.translate.instant('NOTIFICATIONS.NOTIFICATION_ARE_OFF_PLEASE_TURN_ON'),
            buttons: [
                {
                    id: 'not-now-notifications',
                    role: 'cancel',
                    text: this.translate.instant('NOTIFICATIONS.NOT_NOW'),
                },
                {
                    id: 'open-settings',
                    text: this.translate.instant('NOTIFICATIONS.OPEN_SETTINGS'),
                    handler: () => this.nativeSettingsService.openNativeSettings()
                },
            ]
        });
        await dialog.onWillDismiss();
    }

    async requestPermission(): Promise<PermissionState> {
        const currentPerm = await this.checkPermissionStatus();
        if (currentPerm === 'denied') {
            await this.showAlertToAcceptNotifications();
            throw new Error('Notifications denied');
        }
        if (['prompt-with-rationale', 'prompt'].includes(currentPerm)) {
            let shouldStop = false;
            const alert = await this.dialogService.showAlert({
                header: this.translate.instant('NOTIFICATIONS.TURN_ON'),
                message: this.translate.instant('NOTIFICATIONS.PLEASE_TURN_ON'),
                buttons: [
                    {
                        text: this.translate.instant('COMMON.CANCEL'),
                        role: 'cancel',
                        handler: () => {
                            shouldStop = true;
                        }
                    },
                    {
                        text: this.translate.instant('NOTIFICATIONS.ALLOW'),
                        handler: () => {
                            shouldStop = false;
                        }
                    }
                ]
            });
            await alert.onWillDismiss();

            // Yea...
            if (shouldStop) {
                throw new Error('Stopping flow');
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
