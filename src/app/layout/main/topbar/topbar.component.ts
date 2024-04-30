import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { AuthService } from "../../../core/service/auth.service";

import { TokenModel } from "../../../core/model/user.model";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnChanges {
  @Input() leftSidebarGrow: boolean = true;
  @Input() leftSidebarOpen: boolean = false;
  @Input() rightSidebarOpen: boolean = false;

  @Output() leftSidebarGrowChange = new EventEmitter<boolean>();
  @Output() leftSidebarOpenChange = new EventEmitter<boolean>();
  @Output() rightSidebarOpenChange = new EventEmitter<boolean>();

  profile: TokenModel = this.authService.GetTokenPayload();

  constructor(
    private authService: AuthService
  ) { }

  ngOnChanges() {
    this.profile = this.authService.GetTokenPayload();
    console.log(this.profile)
  }

  toggleLeftSidebarGrow() {
    this.leftSidebarGrowChange.emit(!this.leftSidebarGrow);
  }

  toggleLeftSidebarOpen() {
    this.leftSidebarOpenChange.emit(!this.leftSidebarOpen);
  }

  toggleRightSidebarOpen() {
    this.rightSidebarOpenChange.emit(!this.rightSidebarOpen);
  }
}
