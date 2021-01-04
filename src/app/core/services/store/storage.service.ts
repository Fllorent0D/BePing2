import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';

const {Storage} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() {
    }

    async set(key: string, value: any): Promise<void> {
        await Storage.set({key, value: JSON.stringify(value)});
    }

    async get(key: string): Promise<{ value: any }> {
        const ret = await Storage.get({key});
        return JSON.parse(ret.value);
    }

    async keys(): Promise<string[]> {
        return Storage.keys().then(({keys}) => keys);
    }

    async remove(key: string) {
        await Storage.remove({key});
    }

    async clear() {
        await Storage.clear();
    }

    async length(): Promise<number> {
        return Storage.keys().then(({keys}) => keys.length);
    }
}
