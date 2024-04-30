import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnomaliDataComponent } from './component/anomali-data/anomali-data.component';
import { DetailAnomaliDataComponent } from './component/detail-anomali-data/detail-anomali-data.component';

import { DigitalIdComponent } from './component/digital-id/digital-id.component';
import { DetailDigitalIdComponent } from './component/detail-digital-id/detail-digital-id.component';

import { KartuKesehatanComponent } from './component/kartu-kesehatan/kartu-kesehatan.component';
import { DetailKartuKesehatanComponent } from './component/detail-kartu-kesehatan/detail-kartu-kesehatan.component';

import { KartuKaryawanComponent } from './component/kartu-karyawan/kartu-karyawan.component';
import { DetailKartuKaryawanComponent } from './component/detail-kartu-karyawan/detail-kartu-karyawan.component';

import { KartuIdentitasAnakComponent } from './component/kartu-identitas-anak/kartu-identitas-anak.component';
import { DetailKartuIdentitasAnakComponent } from './component/detail-kartu-identitas-anak/detail-kartu-identitas-anak.component';

const routes: Routes = [
  { path: '', component: DigitalIdComponent },
  { path: 'digital-id/ktp', component: DigitalIdComponent },
  { path: 'digital-id/ktp/:id', component: DetailDigitalIdComponent },

  { path: 'digital-id/kartu-kesehatan', component: KartuKesehatanComponent },
  { path: 'digital-id/kartu-kesehatan/:id', component: DetailKartuKesehatanComponent },

  { path: 'digital-id/kartu-karyawan', component: KartuKaryawanComponent },
  { path: 'digital-id/kartu-karyawan/:id', component: DetailKartuKaryawanComponent },

  { path: 'digital-id/kartu-identitas-anak', component: KartuIdentitasAnakComponent },
  { path: 'digital-id/kartu-identitas-anak/:id', component: DetailKartuIdentitasAnakComponent },

  { path: 'pembaruan-aplikasi', component: AnomaliDataComponent },
  { path: 'pembaruan-aplikasi/:id', component: DetailAnomaliDataComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjudicatorRoutingModule { }
