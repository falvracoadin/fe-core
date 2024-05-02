import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormAllComponent } from './formulir/form-all/form-all.component';
import { ListFormulirComponent } from './formulir/list-formulir/list-formulir.component';
import { KelolaDokumenComponent } from './kelola-dokumen/kelola-dokumen.component';
import { KelolaBannerComponent } from './kelola-banner/kelola-banner.component';
import { FormKelolaBannerComponent } from './form-kelola-banner/form-kelola-banner.component';


const routes: Routes = [
  { path: 'formulir', component: ListFormulirComponent },
  { path: 'formulir/:type', component: FormAllComponent },
  { path: 'formulir/:type/:id', component: FormAllComponent },
  { path: 'dokumen', component: KelolaDokumenComponent },
  { path: 'banner', component: KelolaBannerComponent},
  { path: 'banner/:id', component: FormKelolaBannerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
