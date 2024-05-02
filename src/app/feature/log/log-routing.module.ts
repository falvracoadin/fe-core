import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListLogKonsultasiComponent } from './components/list-log-konsultasi/list-log-konsultasi.component';
import { ListLogUserActivityComponent } from './components/list-log-user-activity/list-log-user-activity.component';



const routes: Routes = [
  { path: 'konsultasi', component: ListLogKonsultasiComponent },
  { path: 'activity-user', component: ListLogUserActivityComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogRoutingModule { }
