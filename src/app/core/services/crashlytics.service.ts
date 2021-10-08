import {Injectable} from '@angular/core';
import {FirebaseCrashlytics} from '@capacitor-community/firebase-crashlytics';
import {Device} from '@capacitor/device';

@Injectable({
    providedIn: 'root'
})
export class CrashlyticsService {

    devicePlatform: string;

    async init(): Promise<void> {
        const device = await Device.getInfo();
        this.devicePlatform = device.platform;
    }

    public async crash(): Promise<void> {
        if (this.devicePlatform === 'web') {
            return;
        }
        await FirebaseCrashlytics.crash({message: 'Test'});
    }

    public async logMessage(message: string): Promise<void> {
        if (this.devicePlatform === 'web') {
            return;
        }
        await FirebaseCrashlytics.addLogMessage({message});
    }

    public async recordException(message: string): Promise<void> {
        if (this.devicePlatform === 'web') {
            return;
        }
        await FirebaseCrashlytics.recordException({message});
    }

}
