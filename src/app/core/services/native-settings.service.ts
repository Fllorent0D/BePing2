import {Injectable} from '@angular/core';
import {AndroidSettings, IOSSettings, NativeSettings} from 'capacitor-native-settings';
import {Device} from '@capacitor/device';

@Injectable({
    providedIn: 'root'
})
export class NativeSettingsService {

    constructor() {
    }

    async openNativeSettings(): Promise<void> {
        const platform = await Device.getInfo();

        if (platform.platform === 'ios') {
            await NativeSettings.openIOS({option: IOSSettings.App});
        } else if (platform.platform === 'android') {
            await NativeSettings.openAndroid({option: AndroidSettings.Application});
        }
    }
}
