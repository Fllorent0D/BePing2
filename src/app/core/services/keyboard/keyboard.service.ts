import {Injectable} from '@angular/core';
import {Plugins, Capacitor} from '@capacitor/core';

const {Keyboard} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {

    constructor() {
    }

    public async hideKeyboard(): Promise<void> {
        if (Capacitor.platform !== 'web') {
            await Keyboard.hide();
        }
    }


}
