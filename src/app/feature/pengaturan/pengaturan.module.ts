import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {  PERFECT_SCROLLBAR_CONFIG, 
//           // PerfectScrollbarModule, 
//           PerfectScrollbarConfigInterface 
//         } from 'ngx-perfect-scrollbar';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule, ImageCropperComponent } from 'ngx-image-cropper';

import { PengaturanRoutingModule } from './pengaturan-routing.module';

import { PembaruanAplikasiComponent } from './component/pembaruan-aplikasi/pembaruan-aplikasi.component';
import { LoginKadaluarsaComponent } from './component/login-kadaluarsa/login-kadaluarsa.component';


// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true,
//   wheelSpeed: 0.3
// };

@NgModule({
  declarations: [
    PembaruanAplikasiComponent,
    LoginKadaluarsaComponent,
  ],
  imports: [
    CommonModule,
    PengaturanRoutingModule,
    // PerfectScrollbarModule,
    // ReactiveFormsModule,
    // NgbAlertModule,
    NgModule,
    DataTablesModule,
    // NgSelectModule,
    FormsModule,
    ImageCropperModule
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
export class PengaturanModule { }
