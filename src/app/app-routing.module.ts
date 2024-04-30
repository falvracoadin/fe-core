import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './layout/auth/auth.component';
import { MainComponent } from './layout/main/main.component';

import { AuthenticatedGuard, AuthGuard } from "./core/guard/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: '', component: MainComponent, loadChildren: () => import('./page/main/main.module').then(m => m.MainModule), canActivate: [AuthGuard] },
  { path: '', component: AuthComponent, loadChildren: () => import('./page/auth/auth.module').then(m => m.AuthModule), canActivate: [AuthenticatedGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
