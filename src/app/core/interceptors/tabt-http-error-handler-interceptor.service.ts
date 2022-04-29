import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {DialogService} from '../services/dialog-service.service';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {CrashlyticsService} from '../services/crashlytics.service';

@Injectable({
    providedIn: 'root'
})
export class TabtHttpErrorHandlerInterceptor implements HttpInterceptor {
    constructor(
        private readonly injector: Injector,
        private readonly crashlytics: CrashlyticsService
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            catchError((err) => {
                if (request.url.includes(environment.tabtUrl) &&
                    err instanceof HttpErrorResponse) {
                    const translateService = this.injector.get(TranslateService);
                    const dialogService = this.injector.get(DialogService);
                    switch (err.status) {
                        case 403:
                            this.crashlytics.recordException({message: err.message});
                            dialogService.showToast({
                                message: translateService.instant('ERROR_TABT.FORBIDDEN'),
                                color: 'medium',
                                duration: 3000
                            });
                            break;
                        case 429:
                            this.crashlytics.recordException({message: err.message});
                            dialogService.showToast({
                                message: translateService.instant('ERROR_TABT.TOO_MANY_REQUESTS'),
                                color: 'medium',
                                duration: 3000
                            });
                            break;
                        case 400:
                            this.crashlytics.recordException({message: err.message});
                            dialogService.showToast({
                                message: translateService.instant('ERROR_TABT.BAD_REQUEST', {error: err.statusText}),
                                color: 'medium',
                                duration: 3000
                            });
                            break;
                        case 404:
                            console.log('not found but not specially an error');
                            break;
                        default:
                        case 500:
                            this.crashlytics.recordException({message: err.message});
                            dialogService.showToast({
                                message: translateService.instant('ERROR_TABT.INTERNAL', {error: err.message}),
                                color: 'medium',
                                duration: 3000
                            });
                            break;

                    }
                }
                return throwError(err);
            })
        );

    }
}
