import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDokterComponent } from './component/list-dokter/list-dokter.component';
import { FormDokterComponent } from './component/form-dokter/form-dokter.component';
import { DetailDokterComponent } from './component/detail-dokter/detail-dokter.component';

import { JadwalDokterComponent } from './component/jadwal-dokter/jadwal-dokter.component';
import { TemplateChatComponent } from './component/template-chat/template-chat.component';

import { ListKonsultasiComponent } from './component/list-konsultasi/list-konsultasi.component';
import { DetailKonsultasiComponent } from './component/detail-konsultasi/detail-konsultasi.component';
import { LaporanKonsultasiComponent } from './component/laporan-konsultasi/laporan-konsultasi.component';

import { ListReservasiComponent } from './component/list-reservasi/list-reservasi.component';

import { ListBeliObatComponent } from './component/list-beli-obat/list-beli-obat.component';
import { FormsModule } from '@angular/forms';




const routes: Routes = [
  // { path: '', component: FasilitasKesehatanComponent },

  { path: 'telemedicine/dokter', component: ListDokterComponent },
  { path: 'telemedicine/dokter/add', component: FormDokterComponent },
  { path: 'telemedicine/dokter/:id', component: DetailDokterComponent },

  { path: 'telemedicine/template-chat', component: TemplateChatComponent },
  { path: 'telemedicine/jadwal-dokter', component: JadwalDokterComponent },

  { path: 'konsultasi/konsultasi', component: ListKonsultasiComponent },
  { path: 'konsultasi/konsultasi/:id', component: DetailKonsultasiComponent },
  { path: 'konsultasi/laporan-konsultasi', component: LaporanKonsultasiComponent },

  { path: 'reservasi', component: ListReservasiComponent },

  { path: 'beli-obat', component: ListBeliObatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KesehatanRoutingModule { }
