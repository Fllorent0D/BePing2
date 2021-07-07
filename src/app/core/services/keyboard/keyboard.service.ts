import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {Keyboard} from '@capacitor/keyboard';

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {

    constructor() {
    }

    public async hideKeyboard(): Promise<void> {
        if (Capacitor.getPlatform() !== 'web') {
            await Keyboard.hide();
        }
    }


}
