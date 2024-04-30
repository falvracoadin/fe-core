import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OidcService } from './oidc.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { TokenModel, UserModel } from 'src/app/core/model/user.model';
import Swal from 'sweetalert2';
import { DecryptionService } from 'src/app/core/service/decryption.service';
import { PermissionsService } from 'src/app/core/service/permissions.service';

@Component({
  selector: 'app-oidc',
  templateUrl: './oidc.component.html',
  styleUrls: ['./oidc.component.scss']
})
export class OidcComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private oidcService: OidcService,
    private authService: AuthService,
    private decryptionService: DecryptionService,
    private permissionService: PermissionsService
  ) { }

  ngOnInit(): void {
    const redirect = this.decryptionService.GrabEnvironmentKey("baseUrl") + "/oidc"
    this.activatedRoute.queryParams.forEach((q) => {
      this.oidcService.processOidc(q['code'], redirect).subscribe((res: any) => {
        var response: {
          accessToken: string,
          refreshToken: string,
          tokenType: string,
          expired: string
        }
        response = res.data
        let parsedToken = this.parseJwt(response.accessToken)
        var payloadMember = {
          Email: parsedToken.email,
          Fullname: parsedToken.name,
          Token: response.accessToken
        }
        this.authService.CreateOrUpdateMemberSaas(payloadMember).subscribe((res: any) => {
          let user: UserModel
          user = {
            DeviceId: 'browser',
            Email: parsedToken.email,
            Fullname: parsedToken.name,
            InstallId: 'web',
            RefreshToken: response.refreshToken,
            Status: 'active',
            Token: response.accessToken,
            TokenType: response.tokenType,
            Expiry: response.expired
          }

          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem(
            'refreshTokenPayload',
            JSON.stringify(this.parseJwt(response.refreshToken))
          )
          localStorage.setItem(
            'refreshToken',
            response.refreshToken
          )

          // let expToken = parsedToken.exp * 1000
          // let formattedDate = new Date(expToken)

          // let tokenPayload = {
          //   ClientId: parsedToken.ClientId,
          //   Email: parsedToken.email,
          //   Expired: formattedDate,
          //   Fullname: parsedToken.name,
          //   Permission: parsedToken.groups,
          //   Phone: '',
          //   PlatformScope: 'public',
          //   Source: 'platform',
          //   UserId: parsedToken.UserId,
          //   Username: parsedToken.email,
          //   Image: parsedToken.Image,
          //   jti: parsedToken.jti,
          //   iss: parsedToken.iss,
          //   sub: parsedToken.sub,
          //   sid: parsedToken.sid
          // }

          this.permissionService.GetPermission().subscribe((permission) => {
            this.permissionService.SetPermission(permission)
            window.close()
          })
        })

      })
    })
  }

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
