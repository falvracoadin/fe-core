import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// import { ClickOutsideModule } from 'ng-click-outside';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { VerticalComponent } from './vertical/vertical.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [LayoutComponent, SidebarComponent, TopbarComponent, FooterComponent, RightsidebarComponent, VerticalComponent, AuthComponent],
  imports: [
    CommonModule,
    RouterModule,
    // NgbDropdownModule,
    // ClickOutsideModule,
    // PerfectScrollbarModule,
    FormsModule,
  ],
})
export class LayoutsModule { }
