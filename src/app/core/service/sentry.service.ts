import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';

import { environment } from "../../../environments/environment";
import { DecryptionService } from "./decryption.service";

@Injectable({
  providedIn: 'root'
})
export class SentryService {
  sentryMode = this.decryptionService.GrabEnvironmentKey('sentryMode');
  sentryDns = this.decryptionService.GrabEnvironmentKey('sentryDns');
  sentryEnvironment = this.decryptionService.GrabEnvironmentKey('sentryEnvironment');

  production = this.decryptionService.GrabEnvironmentKey('production');

  constructor(
    private decryptionService: DecryptionService
  ) {
    if (this.sentryMode) {
      Sentry.init({
        dsn: this.sentryDns,
        environment: this.sentryEnvironment,
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracesSampleRate: 1.0,
      });
    }
  }

  captureException(error: any): void {
    if (this.production) {
      Sentry.captureException(error);
    }
  }

  captureMessage(message: string): void {
    if (this.production) {
      Sentry.captureMessage(message);
    }
  }
}
