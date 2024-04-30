import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordGuard } from "../../core/guard/change-password.guard";

import { LoginComponent } from "./login/login.component";
import { LoginComponent2 } from "./login2/login.component2";
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OidcComponent } from './oidc/oidc.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login2', component: LoginComponent2 },
  { path: 'oidc', component: OidcComponent},
  // { path: 'change-password', component: ChangePasswordComponent }, // , canActivate: [ChangePasswordGuard]
  { path: 'forgot-password', component: ForgotPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
