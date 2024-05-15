import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/feature/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element: any;
  configData: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private authService: AuthService
  ) { }

  userName: any;
  userPermission: any;
  isMobileMenuOpen: boolean = false;

  openMobileMenu!: boolean;
  defaultPhoto = 'https://dummyimage.com/1000x1000/000/fff.png&text=';

  @Input() photoProfile!: string;
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.authService.getProfile().subscribe((user: any) => (this.userName = user));
    this.userPermission = this.authService.getUserRole();
    this.openMobileMenu = true;
    this.element = document.documentElement;

    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this.defaultPhoto += this.userName.Fullname.charAt(0).toUpperCase();
    this.checkBrokenImage();
  }

  checkBrokenImage() {
    const img = new Image();
    img.src = this.photoProfile;
    img.onerror = () => {
      this.photoProfile = this.defaultPhoto;
    };
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();

  }
}
