import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { DndModule } from 'ngx-drag-drop';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbAccordionModule, NgbNavModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

import { CmsRoutingModule } from './cms-routing.module';
import { ListFormulirComponent } from './formulir/list-formulir/list-formulir.component';
import { FormAllComponent } from './formulir/form-all/form-all.component';
import { KelolaDokumenComponent } from './kelola-dokumen/kelola-dokumen.component';
import { FormKelolaDokumenComponent } from './form-kelola-dokumen/form-kelola-dokumen.component';
import { KelolaBannerComponent } from './kelola-banner/kelola-banner.component';
import { FormKelolaBannerComponent } from './form-kelola-banner/form-kelola-banner.component';

@NgModule({
  declarations: [
      ListFormulirComponent,
      FormAllComponent,
      KelolaDokumenComponent,
      FormKelolaDokumenComponent,
      KelolaBannerComponent,
      FormKelolaBannerComponent
  ],
    imports: [
        CommonModule,
        CmsRoutingModule,
        // DndModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        // NgbAccordionModule,
        // NgbNavModule,
        // NgbPopoverModule,
        DataTablesModule,
        // NgbTooltipModule,
        // NgbModule
    ]
})
export class CmsModule { }
