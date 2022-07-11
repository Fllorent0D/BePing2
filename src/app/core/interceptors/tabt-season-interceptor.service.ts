import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {TabTState, TabTStateModel} from '../store/user/tab-t-state.service';
import {environment} from '../../../environments/environment';
import {AnalyticsService} from '../services/firebase/analytics.service';
import {SeasonState, SeasonStateModel} from '../store/season';

@Injectable()
export class TabtSeasonInterceptorService implements HttpInterceptor {
    constructor(
        private readonly store: Store,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.url.includes(environment.tabtUrl)) {
            const seasonState: SeasonStateModel = this.store.selectSnapshot(SeasonState);
            const authReq = request.clone({
                headers: request.headers
                    .set('X-Tabt-Season', seasonState.currentSeason.Season.toString(10))
            });
            return next.handle(authReq);

        }

        return next.handle(request);
    }
}
