import {Injectable} from '@angular/core';
import {FirebaseCrashlytics} from '@capacitor-community/firebase-crashlytics';

@Injectable({
    providedIn: 'root'
})
export class CrashlyticsService {

    constructor() {
    }

    public async crash(): Promise<void> {
        await FirebaseCrashlytics.crash({message: 'Test'});
    }

    public async logMessage(message: string): Promise<void> {
        await FirebaseCrashlytics.addLogMessage({message});
    }

    public async recordException(message: string): Promise<void> {
        await FirebaseCrashlytics.recordException({message});
    }

}
