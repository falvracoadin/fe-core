import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PembaruanAplikasiComponent } from './component/pembaruan-aplikasi/pembaruan-aplikasi.component';
import { LoginKadaluarsaComponent } from './component/login-kadaluarsa/login-kadaluarsa.component';

const routes: Routes = [
  { path: 'pembaruan-aplikasi', component: PembaruanAplikasiComponent },
  { path: 'login-kadaluarsa', component: LoginKadaluarsaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PengaturanRoutingModule { }
