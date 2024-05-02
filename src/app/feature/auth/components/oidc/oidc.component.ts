import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { DecryptionService } from 'src/app/core/services/decryption.service';
import { TokenModel, UserModel } from 'src/app/core/model/user.model';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { LandaService } from 'src/app/core/services/landa.service';

@Component({
  selector: 'app-oidc',
  templateUrl: './oidc.component.html',
  styleUrls: ['./oidc.component.scss']
})
export class OidcComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private decryptionService: DecryptionService,
    private permissionsService: PermissionsService,
    private landaService: LandaService,
  ) { }

  ngOnInit(): void {
    this.login()
  }

  async login() {
    try {
      /* login DHI */
      const data = await this.loginDHI()
      if (!data) { 
        this.alertError('Error', 'Terjadi kesalahan')
      }

      /* login keycloak */
      this.loginKeycloak()
    } catch (e) {
      this.landaService.alertError('Error', 'Terjadi kesalahan')
      this.alertError('Error', 'Terjadi kesalahan')
    }
  }

  loginDHI(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const result = this.landaService.DataPost("/web-faskes/auth/login").toPromise()
      result.then((res: any) => {
        const data = {
          token: res.data['AUTH-TOKEN'],
          uuid: res.data['uuid']
        }

        const result = this.decryptionService.encrypt(JSON.stringify(data))
        localStorage.setItem('dhi', result)

        resolve(true)
      }).catch((e) => {
        reject(false)
      })
    })
  }

  loginKeycloak() {
    const redirect = this.decryptionService.GrabEnvironmentKey("baseUrl") + "/oidc"
    this.activatedRoute.queryParams.forEach((q) => {
      this.authService.processOidc(q['code'], redirect).subscribe((res: any) => {
        var response: {
          accessToken: string,
          refreshToken: string,
          tokenType: string,
          expired: string
        }
        response = res.data

        let parsedToken = this.parseJwt(response.accessToken)
        // const interval = setInterval(() => {
        var payloadMember = {
          Email: parsedToken.email,
          Fullname: parsedToken.name,
          Token: response.accessToken
        }
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

        this.authService.CreateOrUpdateMemberSaas(payloadMember).subscribe((res: any) => {
          console.log("status register member : ", res.message)

          let expToken = parsedToken.exp * 1000
          let formattedDate = new Date(expToken)

          let tokenPayload = {
            ClientId: parsedToken.ClientId,
            Email: parsedToken.email,
            Expired: formattedDate,
            Fullname: parsedToken.name,
            Permission: parsedToken.groups,
            Phone: '',
            PlatformScope: 'public',
            Source: 'platform',
            UserId: parsedToken.UserId,
            Username: parsedToken.email,
            Image: parsedToken.Image,
            jti: parsedToken.jti,
            iss: parsedToken.iss,
            sub: parsedToken.sub,
            sid: parsedToken.sid
          }
          localStorage.setItem('tokenPayload', JSON.stringify(tokenPayload));
          // window.close()
          this.permissionsService.GetPermission().subscribe((permission) => {
            this.permissionsService.SetPermission(permission)
            // clearInterval(interval)
            window.close()
          })
        })
        // }, 4000);


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

  alertError(title: string, message: string) {
    this.landaService.alertError(title, message)
    setTimeout(() => {
      window.close()
    }, 2000);
  }
}
