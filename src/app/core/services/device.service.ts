import {Injectable} from '@angular/core';
import {Device, DeviceInfo} from '@capacitor/device';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    private deviceInformation: DeviceInfo;

    constructor() {
        Device.getInfo().then((info) => {
            this.deviceInformation = info;
        });
    }

    get deviceInfo(): DeviceInfo {
        return this.deviceInformation;
    }
}
