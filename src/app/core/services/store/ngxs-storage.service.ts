import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';
import {StorageService} from './storage.service';
import {AsyncStorageEngine} from 'async-storage-plugin-venraij';

@Injectable({
    providedIn: 'root'
})
export class NgxsStorageService implements AsyncStorageEngine {

    constructor(private storage: StorageService) {
    }

    length(): Observable<number> {
        return from(this.storage.length());
    }

    getItem(key: any): Observable<any> {
        return from(this.storage.get(key));
    }

    setItem(key: any, val: any): void {
        this.storage.set(key, val);
    }

    removeItem(key: any): void {
        this.storage.remove(key);
    }

    clear(): void {
        this.storage.clear();
    }

    key(val: number): Observable<string> {
        return from(this.storage.keys().then(keys => keys[val]));
    }
}
