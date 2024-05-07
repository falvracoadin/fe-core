import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule, ImageCropperComponent } from 'ngx-image-cropper';

import { FaskesRoutingModule } from './faskes-routing.module';

import { ListFaskesComponent } from './components/list-faskes/list-faskes.component';
import { FormFaskesComponent } from './components/form-faskes/form-faskes.component';
import { DetailFaskesComponent } from './components/detail-faskes/detail-faskes.component';

import { ListSpesialisComponent } from './components/list-spesialis/list-spesialis.component';
import { DetailSpesialisComponent } from './components/detail-spesialis/detail-spesialis.component';
// import {MatButtonModule} from '@angular/material/button';
// import {
//   MatSlideToggleModule,
//   _MatSlideToggleRequiredValidatorModule,
// } from '@angular/material/slide-toggle';
// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true,
//   wheelSpeed: 0.3
// };


@NgModule({
  declarations: [ListFaskesComponent, FormFaskesComponent, DetailFaskesComponent, ListSpesialisComponent, DetailSpesialisComponent],
  imports: [
    CommonModule,
    FaskesRoutingModule,
    // PerfectScrollbarModule,
    ReactiveFormsModule,
    // NgbAlertModule,
    // NgbModule,
    DataTablesModule,
    NgSelectModule,
    FormsModule,
    ImageCropperModule,
    // MatButtonModule,
    // MatSlideToggleModule,
    // _MatSlideToggleRequiredValidatorModule,
  ],
  providers: [
    // {
    //   provide: PERFECT_SCROLLBAR_CONFIG,
    //   useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    // },
    ImageCropperComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FaskesModule { }
