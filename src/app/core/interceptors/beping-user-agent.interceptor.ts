import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {App} from '@capacitor/app';
import {Device} from '@capacitor/device';

@Injectable()
export class BepingUserAgentInterceptor implements HttpInterceptor {
    private version: string;
    private build: string;
    private model: string;
    private osVersion: string;

    constructor() {
        this.init();
    }

    async init() {
        const info = await App.getInfo();
        const device = await Device.getInfo();

        this.version = info.version;
        this.build = info.build;
        this.model = device.model;
        this.osVersion = device.osVersion;
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.url.includes(environment.tabtUrl)) {

            const authReq = request.clone({
                headers: request.headers.set('User-Agent', `BePing/${this.version}(${this.build}) ${this.model}/${this.osVersion}`)
            });
            return next.handle(authReq);

        }

        return next.handle(request);
    }
}
