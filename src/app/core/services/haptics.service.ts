import {Injectable} from '@angular/core';
import {Haptics, ImpactStyle, NotificationType, VibrateOptions} from '@capacitor/haptics';

@Injectable({
    providedIn: 'root'
})
export class HapticsService {

    constructor() {
    }

    async hapticsImpact(style: ImpactStyle = ImpactStyle.Light) {
        await Haptics.impact({style});
    }

    async hapticsVibrate(options: VibrateOptions) {
        await Haptics.vibrate(options);
    }

    async notification(type: NotificationType) {
        await Haptics.notification({type});
    }

    async hapticsSelectionStart() {
        await Haptics.selectionStart();
    }

    async hapticsSelectionChanged() {
        await Haptics.selectionChanged();
    }

    async hapticsSelectionEnd() {
        await Haptics.selectionEnd();
    }

}
