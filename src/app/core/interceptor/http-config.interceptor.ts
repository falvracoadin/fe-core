import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, map, catchError, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '../service/loader.service';
import { IpService } from '../service/ip.service';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';
import { VenturoService } from '../service/venturo.service';
import { DecryptionService } from '../service/decryption.service';
import { RsaService } from '../service/rsa.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private ipService: IpService,
    private router: Router,
    private authService: AuthService,
    private decryptionService: DecryptionService,
    private rsaService: RsaService,
    private venturoService: VenturoService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.GetToken().Token;

    // get api url
    var isKeycloak =
      this.decryptionService.GrabEnvironmentKey('authMode') === 'keycloak'
        ? true
        : false;
    var apiUrl = this.decryptionService.GrabEnvironmentKey('apiUrl');
    var keycloakUrl = this.decryptionService.GrabEnvironmentKey('keycloakUrl');
    var apiUrlKeycloak =
      this.decryptionService.GrabEnvironmentKey('apiUrlKeycloak');
    // set get ip url
    var getIpURL = apiUrl + '/ip';

    if (['PATCH', 'PUT', 'POST', 'DELETE'].includes(request.method)) {
      this.loaderService.show();
    }

    /* check endpoint /roles/user */
    if (
      token &&
      !request.url.includes('https://s3.loyalto.id/') &&
      !request.url.includes('https://staging-saas-apipg.qoin.id/workspace') &&
      request.url.includes('/roles/user')
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (
      token &&
      !request.url.includes('https://s3.loyalto.id/') &&
      !request.url.includes('https://staging-saas-apipg.qoin.id/workspace') &&
      !request.url.includes(getIpURL) &&
      !request.url.includes('/roles/user')
    ) {
      /* set header encrypted roles */
      const encryptedRoles = localStorage.getItem('authPermissions');
      if (!encryptedRoles && !request.url.includes(apiUrlKeycloak)) {
        this.venturoService.alertError('Terjadi kesalahan', '');
        return throwError('Terjadi kesalahan');
      }

      const decryptedRoles = this.rsaService.decrypt(encryptedRoles, false);
      if (!decryptedRoles || typeof decryptedRoles === 'boolean') {
        this.venturoService.alertError('Terjadi kesalahan', '');
        return throwError('Terjadi kesalahan');
      }

      const roles = {
        roles: JSON.parse(decryptedRoles),
        time: this.venturoService.getCurrentDateTime(60000),
      };

      const encrypted = this.rsaService.encrypt(JSON.stringify(roles), false);
      if (typeof encrypted === 'boolean') {
        this.venturoService.alertError('Terjadi kesalahan', '');
        return throwError('Terjadi kesalahan');
      }

      /* set authorization token */
      if (!request.url.includes(apiUrlKeycloak)) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'X-Prs-Signature': encrypted,
          },
        });
      } else {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }

    if (request.headers && !request.url.includes(getIpURL)) {
      const keyHeader = request.headers.keys();
      if (
        keyHeader.indexOf('Content-Type') !== -1 &&
        keyHeader.indexOf('enctype') !== -1
      ) {
        request = request.clone({
          headers: request.headers.set('Content-Type', 'application/json'),
        });
      }
    }

    if (!request.url.includes(keycloakUrl)) {
      if (!request.url.includes(getIpURL)) {
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json'),
        });

        request = request.clone({
          headers: request.headers.set(
            'X-Forwarded-For',
            this.ipService.GetIpAddressFromLocalStorage()
          ),
        });
      }
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),

      catchError((error: HttpErrorResponse) => {
        if ([403].includes(error.status)) {
          //swal alert danger without button, and dont redirect to anything
          Swal.fire({
            title: 'Ooops',
            text: error?.error?.message,
            icon: 'warning',
            showCancelButton: false,
          });
        }

        if ([401].includes(error.status)) {
          Swal.fire({
            title: 'Ooops',
            text: 'Token Expired, silahkan login ulang',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#21409A',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Login Ulang',
          }).then(() => {
            if (isKeycloak) {
              this.authService.closeOidc()
            } else {
              this.authService.Logout();
            }
            this.router.navigate(['/login']).then();
          });
          return throwError(error);
        }

        return throwError(error);
      }),

      finalize(() => this.loaderService.hide())
    );
  }
}
