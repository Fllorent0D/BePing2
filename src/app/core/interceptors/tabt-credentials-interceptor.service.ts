import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {TabTState, TabTStateModel} from '../store/user/tab-t-state.service';

@Injectable()
export class TabtCredentialsInterceptor implements HttpInterceptor {
    constructor(
        private readonly store: Store
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const afttState: TabTStateModel = this.store.selectSnapshot(TabTState);
        if (afttState?.account && afttState?.password) {
            const authReq = request.clone({
                headers: request.headers
                    .set('X-Tabt-Account', afttState.account)
                    .set('X-Tabt-Password', afttState.password)
            });

            return next.handle(authReq);
        }
        return next.handle(request);
    }
}
