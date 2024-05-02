import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { OidcComponent } from './components/oidc/oidc.component';

@NgModule({
    declarations: [LoginComponent, ForgotPasswordComponent, OidcComponent],
    imports: [
        CommonModule,
        FormsModule,
        // NgbAlertModule,
        AuthRoutingModule,
        ReactiveFormsModule
    ]
})
export class AuthModule { }
