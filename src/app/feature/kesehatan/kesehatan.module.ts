import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule, ImageCropperComponent } from 'ngx-image-cropper';

import { KesehatanRoutingModule } from './kesehatan-routing.module';
import { TemplateChatComponent } from './component/template-chat/template-chat.component';
import { JadwalDokterComponent } from './component/jadwal-dokter/jadwal-dokter.component';
import { DetailTemplateChatComponent } from './component/detail-template-chat/detail-template-chat.component';
import { DetailJadwalDokterComponent } from './component/detail-jadwal-dokter/detail-jadwal-dokter.component';
import { ListDokterComponent } from './component/list-dokter/list-dokter.component';
import { DetailDokterComponent } from './component/detail-dokter/detail-dokter.component';
import { FormDokterComponent } from './component/form-dokter/form-dokter.component';
import { ListKonsultasiComponent } from './component/list-konsultasi/list-konsultasi.component';
import { LaporanKonsultasiComponent } from './component/laporan-konsultasi/laporan-konsultasi.component';
import { DetailKonsultasiComponent } from './component/detail-konsultasi/detail-konsultasi.component';
import { ListReservasiComponent } from './component/list-reservasi/list-reservasi.component';
import { ListBeliObatComponent } from './component/list-beli-obat/list-beli-obat.component';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true,
//   wheelSpeed: 0.3
// };


@NgModule({
  declarations: [TemplateChatComponent, JadwalDokterComponent, DetailTemplateChatComponent, DetailJadwalDokterComponent, ListDokterComponent, DetailDokterComponent, FormDokterComponent, ListKonsultasiComponent, LaporanKonsultasiComponent, DetailKonsultasiComponent, ListReservasiComponent, ListBeliObatComponent],
  imports: [
    CommonModule,
    KesehatanRoutingModule,
    // PerfectScrollbarModule,
    ReactiveFormsModule,
    // NgbAlertModule,
    NgModule,
    DataTablesModule,
    // NgSelectModule,
    FormsModule,
    ImageCropperModule,
  ],
  providers: [
    // {
    //     provide: PERFECT_SCROLLBAR_CONFIG,
    //     useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    // },
    ImageCropperComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KesehatanModule { }
