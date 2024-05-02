import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { LoaderService } from "./core/services/loader.service";
import { DecryptionService } from "./core/services/decryption.service";
// import { OidcSecurityService } from "angular-auth-oidc-client";
import { AuthService } from "./feature/auth/services/auth.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    private loaderService: LoaderService,
    private spinner : NgxSpinnerService,
    private decryptionService: DecryptionService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    // private oidcSecurityService: OidcSecurityService
  ) {
    this.loaderService.isLoading.subscribe((showLoading) => {
      if (showLoading) {
        this.spinner.show().then();
      } else {
        this.spinner.hide().then();
      }
    });
  }

  ngOnInit(): void {
  //   if (this.decryptionService.GrabEnvironmentKey("mode") == "keycloak") {
  //     this.oidcSecurityService.checkAuth().subscribe((auth) => {
  //       console.log("App Comp Auth", auth);
  //       if (auth) {
  //         let token = this.oidcSecurityService.getToken();
  //         this.authService.saveToken(token).then();
  //         this.authService.saveUserLogin(
  //           this.decryptionService.GrabEnvironmentKey("mode")
  //         );
  //         this.authService.savePermission();
  //         setTimeout(() => {
  //           const condition = this.location.path().includes("/login");
  //           if (condition) {
  //             this.router.navigate(["/dashboard"]);
  //           } else {
  //             this.router.navigate([this.location.path()]);
  //           }
  //         }, 1000);
  //       } else {
  //         console.log("NOT LOGGED IN");
  //         this.authService.logout();
  //         this.router.navigate(["/login"]);
  //       }
  //     });
  //   }
  }
}
