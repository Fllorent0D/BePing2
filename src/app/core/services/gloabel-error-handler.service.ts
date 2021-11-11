import {ErrorHandler, Injectable} from '@angular/core';
import {CrashlyticsService} from './crashlytics.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
    constructor(
        private crashlytics: CrashlyticsService
    ) {
    }

    public handleError(error: unknown): void {
        this.handle(error);
    }

    private async handle(error: unknown): Promise<void> {
        try {
            const message = this.getMessageFromUnknownError(error);
            await this.crashlytics.recordException({message});
        } catch (errorHandlerError) {
            console.error(`Internal exception:`, errorHandlerError);
        }
    }

    private getMessageFromUnknownError(error: unknown): string {
        let message = 'An unknown error has occurred.';
        if (error instanceof Object && 'rejection' in error) {
            error = (error as any).rejection;
        }
        if (error instanceof Error && error.message) {
            message = error.message;
        }
        return message;
    }
}
