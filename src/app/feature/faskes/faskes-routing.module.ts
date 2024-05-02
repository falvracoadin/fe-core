import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListFaskesComponent } from './components/list-faskes/list-faskes.component';
import { FormFaskesComponent } from './components/form-faskes/form-faskes.component';
import { DetailFaskesComponent } from './components/detail-faskes/detail-faskes.component';

import { ListSpesialisComponent } from './components/list-spesialis/list-spesialis.component';
import { DetailSpesialisComponent } from './components/detail-spesialis/detail-spesialis.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';


const routes: Routes = [
  // { path: '', component: FasilitasKesehatanComponent },
  { path: 'fasilitas-kesehatan', component: ListFaskesComponent },
  { path: 'fasilitas-kesehatan/add', component: FormFaskesComponent },
  { path: 'fasilitas-kesehatan/:id', component: DetailFaskesComponent },

  { path: 'spesialis', component: ListSpesialisComponent },
  { path: 'spesialis/:id', component: DetailSpesialisComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaskesRoutingModule { }
