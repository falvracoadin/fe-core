import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, finalize } from "rxjs/operators";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

import { AuthService } from "src/app/feature/auth/services/auth.service";
import { LoaderService } from "../services/loader.service";
import { DecryptionService } from "../services/decryption.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private decryptionService: DecryptionService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token : any = this.authService.getToken();
    const tokenCsrf: string = this.authService.getCsrf();
    var isKeycloak = this.decryptionService.GrabEnvironmentKey('mode') === 'keycloak'? true : false;

    if (["PUT", "POST", "DELETE"].includes(request.method)) {
      this.loaderService.show();
    }

    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token.Token),
      });
    }

    if (
      request.method === "GET" &&
      (request.url.includes("https://s3.loyalto.id/dev-health/private") ||
        request.url.includes("https://s3.loyalto.id/staging-health/private") ||
        request.url.includes("https://s3.loyalto.id/prod-health/private"))
    ) {
      request = request.clone({
        headers: request.headers.delete("Authorization"),
      });
    }

    if (
      !request.headers.has("Content-Type") &&
      !request.headers.has("enctype")
    ) {
      request = request.clone({
        headers: request.headers.set("Content-Type", "application/json"),
      });
    }

    request = request.clone({
      headers: request.headers.set("Accept", "application/json"),
    });

    if (!request.url.includes("https://keycloak.qoin.id/")) {
      request = request.clone({
        headers: request.headers.set("X-CSRF-TOKEN", tokenCsrf),
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if ([403, 401].includes(error.status)) {
          Swal.fire({
            title: "Ooops",
            text: error.error.message,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#21409A",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Login Ulang",
          }).then(() => {
            token = null;
            if (isKeycloak) {
              // this.authService.logoutKeycloak();
              this.authService.closeOidc()
            } else {
              this.authService.logout();
            }
            this.router.navigate(["/login"]).then();
          });
          return throwError(error);
        }

        return throwError(error);
      }),
      finalize(() => this.loaderService.hide())
    );
  }
}
