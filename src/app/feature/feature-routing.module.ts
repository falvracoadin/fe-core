import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user/components/list-user/list-user.component';
import { DetailUserComponent } from './user/components/detail-user/detail-user.component';
import { RoleComponent } from './role/role.component';
import { PermissionComponent } from './role/permission/permission.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: 'not-found', component: NotFoundComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user', component: ListUserComponent },
    { path: 'user/:id', component: DetailUserComponent },
    { path: 'role', component: RoleComponent },
    { path: 'role/:id', component: PermissionComponent },
    { path: 'adjudicator', loadChildren: () => import('./adjudicator/adjudicator.module').then(m => m.AdjudicatorModule) },
    { path: 'cms', loadChildren: () => import('./cms/cms.module').then(m => m.CmsModule) },
    { path: 'pengaturan', loadChildren: () => import('./pengaturan/pengaturan.module').then(m => m.PengaturanModule) },
    { path: 'kesehatan', loadChildren: () => import('./kesehatan/kesehatan.module').then(m => m.KesehatanModule) },
    { path: 'faskes', loadChildren: () => import('./faskes/faskes.module').then(m => m.FaskesModule) },

    { path: 'logs', loadChildren: () => import('./log/log.module').then(m => m.LogModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule { }
