import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { AuthService } from "../../feature/auth/services/auth.service";
import { DecryptionService } from "src/app/core/services/decryption.service";

@Component({
  selector: "app-vertical",
  templateUrl: "./vertical.component.html",
  styleUrls: ["./vertical.component.scss"],
})

/**
 * Vertical component
 */
export class VerticalComponent implements OnInit, AfterViewInit {
  isCondensed = false;
  profilePhoto: string = "assets/images/blank-photo.jpg";

  constructor(
    private router: Router,
    private decryptionService: DecryptionService,
    private authService: AuthService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        document.body.classList.remove("sidebar-enable");
      }
    });
  }

  ngOnInit() {
    if (this.decryptionService.GrabEnvironmentKey("mode")) {
      this.authService.getProfile().subscribe((user: any) => {
        this.profilePhoto =
          user.ProfileImage != "" || user.ProfileImage != undefined
            ? user.ProfileImage
            : this.profilePhoto;
        // this.profilePhoto = "assets/images/blank-photo.jpg";
      });
    } else {
      this.authService.getProfilePhoto().subscribe((user: any) => {
        this.profilePhoto = user.data.ProfileImage;
        if (this.profilePhoto === "") {
          this.profilePhoto = "assets/images/blank-photo.jpg";
        }
      });
    }

    document.body.removeAttribute("data-layout");
    document.body.removeAttribute("data-topbar");
    document.body.removeAttribute("data-layout-size");
    document.body.classList.remove("sidebar-enable");
    document.body.classList.remove("vertical-collpsed");
    document.body.removeAttribute("data-sidebar-size");
  }

  isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      ua
    );
  }

  ngAfterViewInit() {}

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle("right-bar-enabled");
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    this.isCondensed = !this.isCondensed;
    document.body.classList.toggle("sidebar-enable");
    document.body.classList.toggle("vertical-collpsed");

    if (window.screen.width <= 768) {
      document.body.classList.remove("vertical-collpsed");
    }
  }
}
