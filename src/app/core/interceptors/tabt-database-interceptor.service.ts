import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {LANG} from '../models/langs';
import {SettingsState} from '../store/settings';

export enum TABT_DATABASES {
    AFTT = 'aftt',
    VTTL = 'vttl'
}


@Injectable()
export class TabtDatabaseInterceptor implements HttpInterceptor {

    constructor(
        private readonly store: Store
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const lang: LANG = this.store.selectSnapshot(SettingsState.getCurrentLang);
        const database: TABT_DATABASES = lang === LANG.NL ? TABT_DATABASES.VTTL : TABT_DATABASES.AFTT;

        const newBody = request.urlWithParams;
        console.log(newBody);

        const authReq = request.clone({
            headers: request.headers.set('X-Tabt-Database', database).set('X-Tabt-Season', '22')
        });


        return next.handle(authReq);
    }
}
