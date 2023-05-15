import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {TabTState, TabTStateModel} from '../store/user/tabt.state';
import {AnalyticsService} from '../services/firebase/analytics.service';

@Injectable()
export class TabtCredentialsInterceptor implements HttpInterceptor {
    constructor(
        private readonly store: Store,
        private readonly analyticsService: AnalyticsService
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (request.url.includes('tabt-rest.floca.be') || request.url.includes('api.beping.be')) {
            const afttState: TabTStateModel = this.store.selectSnapshot(TabTState);
            const pathname = new URL(request.urlWithParams).pathname;
            if (afttState?.account && afttState?.password) {
                this.analyticsService.logEvent('tabt_call', {tabt_url: pathname, authenticated: 'yes'});
                const authReq = request.clone({
                    headers: request.headers
                        .set('X-Tabt-Account', afttState.account)
                        .set('X-Tabt-Password', afttState.password)
                });

                return next.handle(authReq);
            }
            this.analyticsService.logEvent('tabt_call', {pathname, authenticated: 'no'});
        }

        return next.handle(request);
    }
}
