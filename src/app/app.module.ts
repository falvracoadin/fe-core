import { AsyncPipe } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, ErrorHandler, APP_INITIALIZER } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";

import { HttpConfigInterceptor } from "./core/interceptors/http-config.interceptor";
import { LayoutsModule } from "./layouts/layouts.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthService } from "./feature/auth/services/auth.service";
// import {
//   NgbDateAdapter,
//   NgbDateParserFormatter,
// } from "@ng-bootstrap/ng-bootstrap";
// import {
//   CustomAdapter,
//   CustomDateParserFormatter,
// } from "./core/adapter/datepicker-adapter";

import { SentryService } from "./core/services/sentry.service";
import { GlobalErrorHandler } from "./core/handler/global-error-handler";

import { DecryptionService } from "./core/services/decryption.service";
// import { AuthModule, OidcConfigService } from "angular-auth-oidc-client";
import { environment } from "src/environments/environment";


// export function configureAuth(oidcConfigService: OidcConfigService) {
//   return () =>
//     oidcConfigService.withConfig({
//       stsServer: environment.oidc_url,
//       redirectUrl: window.location.origin,
//       postLogoutRedirectUri: window.location.origin,
//       clientId: environment.oidc_clientId,
//     });
// }

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    // AuthModule.forRoot(),
  ],
  providers: [
    AsyncPipe,
    SentryService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    // OidcConfigService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: configureAuth,
    //   deps: [OidcConfigService],
    //   multi: true,
    // },
    // { provide: NgbDateAdapter, useClass: CustomAdapter },
    // { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private authService: AuthService,
    private decryptionService: DecryptionService
  ) {
    const platformkey = localStorage.getItem("platformKey");
    if (this.authService.getToken() !== null && platformkey) {
      this.authService.saveUserLogin(
        this.decryptionService.GrabEnvironmentKey("mode"),
        platformkey
      );
    }
  }
}
