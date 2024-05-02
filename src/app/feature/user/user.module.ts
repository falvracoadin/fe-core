import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormUserComponent } from './components/form-user/form-user.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailUserComponent } from './components/detail-user/detail-user.component';

@NgModule({
  declarations: [FormUserComponent, ListUserComponent, DetailUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // NgSelectModule,
    DataTablesModule,
    // NgModule,
    SharedModule,
    // NgbDropdownModule,
  ]
})
export class UserModule { }
