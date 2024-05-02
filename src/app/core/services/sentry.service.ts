import { Injectable } from '@angular/core';
// import * as Sentry from '@sentry/angular';

import { DecryptionService } from './decryption.service';

@Injectable({
    providedIn: 'root',
})
export class SentryService {
    constructor(
        private decryptionService: DecryptionService,
    ) {
        if (this.decryptionService.GrabEnvironmentKey('sentry_mode')) {
            // Sentry.init({
            //     dsn: this.decryptionService.GrabEnvironmentKey('sentry_dns'),
            //     environment: this.decryptionService.GrabEnvironmentKey('sentry_environment'),
            //     // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
            //     tracesSampleRate: 1.0,
            // });
        }
    }

    captureException(error: any): void {
        if (this.decryptionService.GrabEnvironmentKey('production')) {
            // Sentry.captureException(error);
        }
    }

    captureMessage(message: string): void {
        if (this.decryptionService.GrabEnvironmentKey('production')) {
            // Sentry.captureMessage(message);
        }
    }
}
