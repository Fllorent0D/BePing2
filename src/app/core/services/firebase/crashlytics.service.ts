import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';

const {FirebaseCrashlytics} = Plugins;

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

