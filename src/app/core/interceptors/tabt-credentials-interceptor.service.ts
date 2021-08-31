import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {TabTState, TabTStateModel} from '../store/user/tab-t-state.service';
import {environment} from '../../../environments/environment';
import {AnalyticsService} from '../services/firebase/analytics.service';

@Injectable()
export class TabtCredentialsInterceptor implements HttpInterceptor {
    constructor(
        private readonly store: Store,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.url.includes(environment.tabtUrl)) {
            const afttState: TabTStateModel = this.store.selectSnapshot(TabTState);
            if (afttState?.account && afttState?.password) {
                this.analyticsService.logEvent('tabt_call', {url: request.url, authenticated: true});
                const authReq = request.clone({
                    headers: request.headers
                        .set('X-Tabt-Account', afttState.account)
                        .set('X-Tabt-Password', afttState.password)
                });

                return next.handle(authReq);
            }
            this.analyticsService.logEvent('tabt_call', {url: request.url, authenticated: false});
        }

        return next.handle(request);
    }
}
