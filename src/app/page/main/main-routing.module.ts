import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as PermissionData from '../../core/data/permission.json';
import { PermissionGuard } from 'src/app/core/guard/permission.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const permissionData = PermissionData;
const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
  },
  {
    path: 'adjudicator', loadChildren: () => import('./adjudicator/adjudicator.module').then(m => m.AdjudicatorModule)
  }

  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
