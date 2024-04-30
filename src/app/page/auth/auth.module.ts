import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AlertModule } from "ngx-bootstrap/alert";

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { LoginComponent2 } from './login2/login.component2';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ToastrModule } from 'ngx-toastr';

import { RecaptchaModule } from "ng-recaptcha";
import { OidcComponent } from './oidc/oidc.component';


@NgModule({
  declarations: [
    LoginComponent,
    LoginComponent2,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    OidcComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    AlertModule.forRoot(),

    AuthRoutingModule,
    ToastrModule.forRoot(),
    RecaptchaModule
  ]
})
export class AuthModule { }
