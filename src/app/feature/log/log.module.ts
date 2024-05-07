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

import { LogRoutingModule } from './log-routing.module';
import { ListLogKonsultasiComponent } from './components/list-log-konsultasi/list-log-konsultasi.component';
import { ListLogUserActivityComponent } from './components/list-log-user-activity/list-log-user-activity.component';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true,
//   wheelSpeed: 0.3
// };


@NgModule({
  declarations: [ListLogKonsultasiComponent, ListLogUserActivityComponent],
  imports: [
    CommonModule,
    LogRoutingModule,
    // PerfectScrollbarModule,
    ReactiveFormsModule,
    // NgbAlertModule,
    // NgModule,
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
export class LogModule { }
