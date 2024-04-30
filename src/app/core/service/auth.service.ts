import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { SaasService } from './saas.service';
import { IpService } from './ip.service';

import { UserModel, TokenModel, RefreshTokenModel } from '../model/user.model';

import { environment } from '../../../environments/environment';

import { PermissionsService } from './permissions.service';
import { DecryptionService } from './decryption.service';
import { VenturoService } from './venturo.service';
// import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private saasService: SaasService,
    private ipService: IpService,
    private permissionsService: PermissionsService,
    private decryptionService: DecryptionService,
    private venturoService: VenturoService
    // private oidcSecurityService: OidcSecurityService
  ) { }

  saasUrl = this.decryptionService.GrabEnvironmentKey('saasUrl');
  apiUrl = this.decryptionService.GrabEnvironmentKey('apiUrl');
  apiUrlKeycloak = this.decryptionService.GrabEnvironmentKey('apiUrlKeycloak');

  GetToken(): UserModel {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  GetTokenPayload(): TokenModel {
    return JSON.parse(localStorage.getItem('tokenPayload') || '{}');
  }

  SetTokenPayload(payload: TokenModel) {
    localStorage.setItem('tokenPayload', JSON.stringify(payload));
  }

  GetRefreshTokenPayload(): RefreshTokenModel {
    return JSON.parse(localStorage.getItem('refreshTokenPayload') || '{}');
  }

  getProfileFromLocalStorage() {
    const profileString = localStorage.getItem('user');
    if (!profileString) {
      return null;
    }

    return JSON.parse(profileString);
  }

  GetUserRole() {
    let role = {
      supervisor: false,
      operator: false,
      superadmin: false,
    };

    // const tokenPayload = this.GetTokenPayload()
    // const permission = tokenPayload.Permission
    // if (permission) {
    // const superV = permission.find((p) => p === 'Web:AdjSp:All');
    // const oprtr = permission.find((p) => p === 'Web:AdjOps:All');
    // const superA = permission.find((p) => p === 'Web:AdjAdmin:All');
    // const superV = permission.find((p) => p === 'Admin:Supervisor');
    // const oprtr = permission.find((p) => p === 'Admin:Operator');
    // const superA = permission.find((p) => p === 'Admin:Superadmin');
    const superV = this.permissionsService.hasPermission(
      'web:iddigitalktp:supervisor'
    );
    const oprtr = this.permissionsService.hasPermission(
      'web:iddigitalktp:operator'
    );
    const superA = this.permissionsService.hasPermission(
      'web:iddigitalktp:superadmin'
    );

    role = {
      supervisor: superV,
      operator: oprtr,
      superadmin: superA,
    };
    // }

    return role;
  }

  Login(payload: any) {
    const loginPayload = {
      Email: payload.Email,
      Password: payload.Password,
      InstallId: 'web',
      DeviceId: 'browser',
      DeviceType: 'web',
      DeviceBrand: '-',
      DeviceModel: '-',
      Location: '-',
      IP: this.ipService.GetIpAddressFromLocalStorage(),
    };

    const headers = new HttpHeaders({
      Platformkey: this.saasService.GetPlatformKeyFromLocalStorage(),
    });

    return this.http.post(this.saasUrl + '/access/v2/login/app', loginPayload, {
      headers,
    });
  }

  Logout() {
    // localStorage.removeItem('tokenPayload');
    // localStorage.removeItem('user');
    // localStorage.removeItem('refreshTokenPayload');
    localStorage.clear()

    setTimeout(() => {
      this.router.navigate(['/login']).then();
      window.location.reload();
    }, 1);
  }

  ForgotPassword(payload: any) {
    const headers = new HttpHeaders({
      Platformkey: this.saasService.GetPlatformKeyFromLocalStorage(),
    });

    return this.http.post(
      this.saasUrl + '/access/v2/platform/password/forgot',
      payload,
      { headers }
    );
  }

  EditProfile(payload: any) {
    const headers = new HttpHeaders({
      Platformkey: this.saasService.GetPlatformKeyFromLocalStorage(),
    });

    return this.http.put(
      this.saasUrl + '/access/v2/platform/profile/edit',
      payload,
      { headers }
    );
  }

  ChangePassword(payload: any) {
    const headers = new HttpHeaders({
      Platformkey: this.saasService.GetPlatformKeyFromLocalStorage(),
    });

    const newPayload = {
      OldPassword: payload.OldPassword,
      NewPassword: payload.NewPassword,
      NewPasswordConfirmation: payload.NewPasswordConfirmation,
      InstallId: 'web',
      DeviceId: 'browser',
      DeviceType: 'web',
      DeviceBrand: '-',
      DeviceModel: '-',
      Location: '-',
      IP: this.ipService.GetIpAddressFromLocalStorage(),
    };

    return this.http.post(
      this.saasUrl + '/access/v2/platform/password/change',
      newPayload,
      { headers }
    );
  }

  CreateOrUpdateMemberSaas(payload: any) {
    payload.InstallId = 'web';
    payload.DeviceId = 'browser';
    payload.DeviceType = 'web';
    payload.Email = payload.Email.toLowerCase();
    payload.Fullname = payload.Fullname.toLowerCase();

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + payload.Token,
    });

    return this.http.post(this.apiUrl + '/saas/register/app', payload, {
      headers,
    });
  }

  // logoutKeycloak() {
  //   this.oidcSecurityService.logoff().subscribe((result) => {
  //     this.Logout();
  //   });
  // }

  getProfileKeycloak() {
    return this.http.get(this.apiUrlKeycloak);
  }

  updateProfileKeycloak(payload: any) {
    return this.http.post(this.apiUrlKeycloak, payload);
  }

  initOidc() {
    const apiUrl = this.decryptionService.GrabEnvironmentKey("apiUrl")
    return this.http.get(apiUrl + '/oidc/init')
  }

  closeOidc() {
    const redirect = this.decryptionService.GrabEnvironmentKey("baseUrl")
    const clientId = this.decryptionService.GrabEnvironmentKey("keycloakClientId")
    const keycloakUrl = this.decryptionService.GrabEnvironmentKey("keycloakAuthority")
    window.location.href = keycloakUrl + '/protocol/openid-connect/logout?post_logout_redirect_uri=' + encodeURIComponent(redirect) + "&client_id=" + clientId
  }

  userInfoOidc() {
    const user = this.GetToken()
    const refreshToken = localStorage.getItem("refreshToken")
    return this.venturoService.DataPost("/oidc/user-info", {
      AccessToken: user.Token,
      TokenType: user.TokenType,
      RefreshToken: refreshToken,
      Expiry: user.Expiry
    }, true, false)
  }
}
