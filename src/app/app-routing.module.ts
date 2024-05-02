import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthComponent } from './layouts/auth/auth.component';

import { LayoutComponent } from './layouts/layout.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AuthComponent,
        loadChildren: () => import('./feature/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '',
        component: LayoutComponent,
        loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
        canActivate : [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
