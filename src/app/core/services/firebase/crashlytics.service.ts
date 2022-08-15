import {Injectable} from '@angular/core';

import {FirebaseCrashlytics} from '@capacitor-firebase/crashlytics';

@Injectable({
    providedIn: 'root'
})
export class CrashlyticsService {

    constructor() {
    }


    crash() {
        FirebaseCrashlytics.crash({
            message: 'This is a crash message: Capacitor is awesome! 😃'
        });
    }
}

