import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
// import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// import { ChartsModule } from 'ng2-charts';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FeatureRoutingModule } from './feature-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserModule } from './user/user.module';
import { RoleComponent } from './role/role.component';
import { DataTablesModule } from 'angular-datatables';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PermissionComponent } from './role/permission/permission.component';


import { StatsCardComponent } from '../component/stats-card/stats-card.component';
import { ChartPendapatanComponent } from '../component/chart-pendapatan/chart-pendapatan.component';
import { ChartTrendComponent } from '../component/chart-trend/chart-trend.component';
import { DecryptionService } from '../core/services/decryption.service';
import { AuthService } from './auth/services/auth.service';
import { NotFoundComponent } from './not-found/not-found.component';


// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//     suppressScrollX: true,
//     wheelSpeed: 0.3
// };

@NgModule({
    declarations: [
        DashboardComponent,
        RoleComponent,
        PermissionComponent,

        StatsCardComponent,
        ChartPendapatanComponent,
        ChartTrendComponent,
        NotFoundComponent
    ],
    imports: [
        ReactiveFormsModule,
        // NgbAlertModule,
        CommonModule,
        FeatureRoutingModule,
        // PerfectScrollbarModule,
        UserModule,
        // ChartsModule,
        // NgbModule,
        DataTablesModule,
        FormsModule,
        // NgSelectModule,
    ],
    providers: [
        // {
        //     provide: PERFECT_SCROLLBAR_CONFIG,
        //     useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        // }
    ]
})
export class FeatureModule {
    constructor(
        decryptionService: DecryptionService,
        authService: AuthService
    ) {

        /* pengecekan apakah user logout atau tidak saat pakai keycloak */
        const mode = decryptionService.GrabEnvironmentKey("mode")
        if (mode === 'keycloak') {
            setTimeout(() => {
                if (authService.getToken().Token) {
                  authService.userInfoOidc()?.subscribe((res: any) => {
                    localStorage.setItem('user-info-oidc', JSON.stringify(res.data))
                  }, (err) => {
                    authService.logout()
                  })
                }
              }, 2000);
        }
    }
}
