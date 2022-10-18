import {Injectable} from '@angular/core';
import {FirebaseCrashlytics} from '@capacitor-firebase/crashlytics';
import {fromError} from 'stacktrace-js';

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

    public async recordException(message: string, error?: Error): Promise<void> {
        try {
            const stacktrace = error ? await fromError(error) : undefined;
            await FirebaseCrashlytics.recordException({
                message,
                stacktrace
            });
        } catch (e) {
            console.error('Unable to report error to crashlytics', e);
        }

    }

}
