import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from './page-title/page-title.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DaterangepickerComponent } from './daterangepicker/daterangepicker.component';
// import { Daterangepicker } from 'ng2-daterangepicker';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PageTitleComponent, 
    // DaterangepickerComponent, 
    UploadImageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ImageCropperModule,
    // Daterangepicker
  ],
  exports: [
    PageTitleComponent,
    // DaterangepickerComponent,
    UploadImageComponent
  ]
})
export class SharedModule { }
