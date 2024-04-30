import { NgModule, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';

import { SharedModule } from '../../shared/shared.module';

import { NotFoundComponent } from '../../error-page/not-found/not-found.component';

import { NgChartsModule } from "ng2-charts";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DataTablesModule } from "angular-datatables";
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSliderModule } from 'ngx-slider-v2';
import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { ToastrModule } from 'ngx-toastr';
import { now } from 'moment/moment';
import { AuthService } from '../../core/service/auth.service';
import { PermissionsService } from '../../core/service/permissions.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DecryptionService } from 'src/app/core/service/decryption.service';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { idLocale } from 'ngx-bootstrap/locale';
import { OidcService } from '../auth/oidc/oidc.service';
import { UserModel } from 'src/app/core/model/user.model';
import { DashboardComponent } from './dashboard/dashboard.component';
defineLocale('id', idLocale);
@NgModule({
  declarations: [
    NotFoundComponent,

    NotFoundComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxSliderModule,

    MainRoutingModule,
    TimepickerModule.forRoot(),
    NgChartsModule,
    NgSelectModule,
    TooltipModule,
    DataTablesModule,
    BsDatepickerModule,
    ModalModule.forRoot(),
    CKEditorModule,
    BsDropdownModule,
    ImageCropperModule,
    NgxSkeletonLoaderModule.forRoot(),
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    CdkDragHandle,
    ToastrModule.forRoot(),
    NgxMaterialTimepickerModule,
    LeafletModule,
  ],
})
export class MainModule {
  refreshInterval: any;
  constructor(
    private authService: AuthService,
    private decryptionService: DecryptionService,
    private permission: PermissionsService,
    private oidcService: OidcService
  ) {

    //set interval
    if (!this.refreshInterval) {
      this.refreshInterval = setInterval(() => {
        this.oidcService.refreshToken()?.subscribe((res: any) => {
          var response: {
            accessToken: string,
            refreshToken: string,
            tokenType: string,
            expired: string
          }
          response = res.data

          let parsedToken = this.parseJwt(response.accessToken)
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
        }, (err) => {
          clearTimeout(this.refreshInterval)
        })
      }, 40000)
    }

    //check oidc
    if (this.decryptionService.GrabEnvironmentKey("authMode") == "keycloak") {
      setTimeout(() => {
        if (this.authService.GetToken().Token) {
          this.authService.userInfoOidc()?.subscribe((res: any) => {
            localStorage.setItem('user-info-oidc', JSON.stringify(res.data))
          }, (err) => {
            this.authService.Logout()
          })
        }
      }, 2000);
    }
    let tokenPayload: any = this.authService.GetTokenPayload();
    if (tokenPayload.UserId) {
      this.permission.GetPermission().subscribe((permissions) => {
        this.permission.SetPermission(permissions);
      });
    }

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
