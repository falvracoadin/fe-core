import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule, ImageCropperComponent } from 'ngx-image-cropper';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { idLocale } from 'ngx-bootstrap/locale';

// import { MomentDateFormatter } from './ngb-date';

import { AdjudicatorRoutingModule } from './adjudicator-routing.module';

import { DigitalIdComponent } from './component/digital-id/digital-id.component';
import { DetailDigitalIdComponent } from './component/detail-digital-id/detail-digital-id.component';

import { AnomaliDataComponent } from './component/anomali-data/anomali-data.component';
import { DetailAnomaliDataComponent } from './component/detail-anomali-data/detail-anomali-data.component';

import { KartuKesehatanComponent } from './component/kartu-kesehatan/kartu-kesehatan.component';
import { DetailKartuKesehatanComponent } from './component/detail-kartu-kesehatan/detail-kartu-kesehatan.component';
import { KartuKaryawanComponent } from './component/kartu-karyawan/kartu-karyawan.component';
import { DetailKartuKaryawanComponent } from './component/detail-kartu-karyawan/detail-kartu-karyawan.component';
import { KartuIdentitasAnakComponent } from './component/kartu-identitas-anak/kartu-identitas-anak.component';
import { DetailKartuIdentitasAnakComponent } from './component/detail-kartu-identitas-anak/detail-kartu-identitas-anak.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.3
};
defineLocale('id', idLocale);

@NgModule({
  declarations: [
    DigitalIdComponent,
    AnomaliDataComponent,
    DetailDigitalIdComponent,
    DetailAnomaliDataComponent,
    KartuKesehatanComponent,
    DetailKartuKesehatanComponent,
    KartuKaryawanComponent,
    DetailKartuKaryawanComponent,
    KartuIdentitasAnakComponent,
    DetailKartuIdentitasAnakComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    ReactiveFormsModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule,
    ModalModule.forRoot(),
    BsDropdownModule,
    AdjudicatorRoutingModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    ImageCropperModule,
    TooltipModule,

  ],
  providers: [
    {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ImageCropperComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdjudicatorModule { }
