import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PageTitleComponent } from './page-title/page-title.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { DataTableComponent } from './data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    PageTitleComponent,
    DataTableComponent,
  ],
  exports: [
    PageTitleComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    NgChartsModule,
    BsDatepickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
