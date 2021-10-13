import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {LANG} from '../models/langs';
import {SettingsState} from '../store/settings';
import {ClubCategory} from '../models/club';

export enum TABT_DATABASES {
    AFTT = 'aftt',
    VTTL = 'vttl'
}

export const AFTT_CLUB_CATEGORIES = [
    ClubCategory.HAINAUT,
    ClubCategory.LIEGE,
    ClubCategory.LUXEMBOURG,
    ClubCategory.BRUSSELS_BRABANT_WALLON,
    ClubCategory.NAMUR,
];

export const VTTL_CLUB_CATEGORIES = [
    ClubCategory.VLAAMS_BRABANT_BR,
    ClubCategory.OOST_VLANDEREN,
    ClubCategory.WEST_VLAANDEREN,
    ClubCategory.ANTWERP,
    ClubCategory.LIMBURG,
];


@Injectable()
export class TabtDatabaseInterceptor implements HttpInterceptor {

    constructor(
        private readonly store: Store
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const database: TABT_DATABASES = this.store.selectSnapshot(SettingsState.getCurrentDatabase) || TABT_DATABASES.AFTT;
        const newBody = request.urlWithParams;
        console.log(newBody);

        const authReq = request.clone({
            headers: request.headers.set('X-Tabt-Database', database)
        });


        return next.handle(authReq);
    }
}
