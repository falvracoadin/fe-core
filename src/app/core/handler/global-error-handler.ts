import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { SentryService } from '../services/sentry.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(error: any): void {
        const sentryService = this.injector.get(SentryService);
        sentryService.captureException(error);

        // Optionally, rethrow the error for normal error handling
        // throw error;
    }
}
