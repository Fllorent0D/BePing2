import {Injectable} from '@angular/core';
import {FirebaseCrashlytics, RecordExceptionOptions} from '@capacitor-firebase/crashlytics';
import {Device} from '@capacitor/device';

@Injectable({
    providedIn: 'root'
})
export class CrashlyticsService {

    public async crash(): Promise<void> {
        await FirebaseCrashlytics.crash({message: 'Test'});
    }

    public async logMessage(message: string): Promise<void> {
        await FirebaseCrashlytics.log({message});
    }

    public async recordException(exception: RecordExceptionOptions): Promise<void> {
        await FirebaseCrashlytics.recordException(exception);
    }

}
