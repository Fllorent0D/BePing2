import {Injectable} from '@angular/core';
import {Preferences} from '@capacitor/preferences';


@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() {
    }

    async set(key: string, value: any): Promise<void> {
        await Preferences.set({key, value: JSON.stringify(value)});
    }

    async get(key: string): Promise<{ value: any }> {
        const ret = await Preferences.get({key});
        return JSON.parse(ret.value);
    }

    async keys(): Promise<string[]> {
        return Preferences.keys().then(({keys}) => keys);
    }

    async remove(key: string) {
        await Preferences.remove({key});
    }

    async clear() {
        await Preferences.clear();
    }

    async length(): Promise<number> {
        return Preferences.keys().then(({keys}) => keys.length);
    }
}
