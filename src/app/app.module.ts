import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthComponent } from './layout/auth/auth.component';
import { MainComponent } from './layout/main/main.component';

import { HttpConfigInterceptor } from './core/interceptor/http-config.interceptor';
import { GlobalErrorHandler } from './core/handler/global-error-handler';

import { SentryService } from './core/service/sentry.service';
import { IpService } from './core/service/ip.service';
import { AuthService } from './core/service/auth.service';

import { TopbarComponent } from './layout/main/topbar/topbar.component';
import { LeftSidebarComponent } from './layout/main/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './layout/main/right-sidebar/right-sidebar.component';
import { FooterComponent } from './layout/main/footer/footer.component';

import { NgChartsModule } from 'ng2-charts';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import * as moment from 'moment';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxSliderModule } from 'ngx-slider-v2';
import { LottieModule } from 'ngx-lottie';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DecryptionService } from './core/service/decryption.service';

export function playerFactory() {
  return import('lottie-web');
}

const decryptionService = new DecryptionService();

@NgModule({
  declarations: [
    AppComponent,

    AuthComponent,

    MainComponent,
    TopbarComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgChartsModule.forRoot(),
    AlertModule.forRoot(),
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    CKEditorModule,
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    LottieModule.forRoot({ player: playerFactory }),
    ToastrModule.forRoot(),
    LeafletModule,
  ],
  providers: [
    SentryService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private authService: AuthService,
    private ipService: IpService,
  ) {

    const ipAddress = this.ipService.GetIpAddressFromLocalStorage();

    if (ipAddress === '') {
      this.ipService.GetIpAddress().subscribe((ipAddressResponse) => {
        this.ipService.SetIpAddress(ipAddressResponse);
      });
    }
    if (moment().isAfter(this.authService.GetTokenPayload().Expired)) {
      this.authService.Logout();
    }
  }
}
