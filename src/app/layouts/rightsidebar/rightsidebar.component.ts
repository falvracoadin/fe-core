import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

import Swal from "sweetalert2";

import { AuthService } from "../../feature/auth/services/auth.service";
import { ProfileService } from "../sidebar/service/profile.service";
import { LandaService } from "../../core/services/landa.service";
import { DecryptionService } from "../../core/services/decryption.service";

@Component({
  selector: "app-rightsidebar",
  templateUrl: "./rightsidebar.component.html",
  styleUrls: ["./rightsidebar.component.scss"],
})

/**
 * Rightsidebar component
 */
export class RightsidebarComponent implements OnInit {
  @Input() photoProfile !: string;

  part = "main";

  user: any;

  OldPassword = "";
  NewPassword = "";
  PasswordConfirmation = "";

  Fullname = "";
  Email = "";
  defaultPhoto = "https://dummyimage.com/1000x1000/000/fff.png&text=";
  isKeycloak: boolean = false;
  keycloakProfile: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private landaService: LandaService,
    private decryptionService: DecryptionService
  ) {}

  ngOnInit() {
    this.isKeycloak =
      this.decryptionService.GrabEnvironmentKey("mode") == "keycloak";
    this.authService.getProfile().subscribe((user: any) => (this.user = user));
    this.Fullname = this.user.Fullname;
    this.Email = this.user.Email;
    this.hide();
    this.defaultPhoto += this.user.Fullname.charAt(0).toUpperCase();
    this.checkBrokenImage();
    if (this.isKeycloak) {
      this.getProfileKeycloak();
    }
  }

  checkBrokenImage() {
    const img = new Image();
    img.src = this.photoProfile;
    img.onerror = () => {
      this.photoProfile = this.defaultPhoto;
    };
  }

  /**
   * Hide the sidebar
   */
  public hide() {
    document.body.classList.remove("right-bar-enabled");
  }

  logOut() {
    if (this.isKeycloak) {
      // this.authService.logoutKeycloak();
      this.authService.closeOidc()
    } else {
      this.authService.logout();
      this.router.navigate(["/login"]).then();
    }
  }

  submitChangePassword() {
    const body = {
      OldPassword: this.OldPassword,
      NewPassword: this.NewPassword,
      PasswordConfirmation: this.PasswordConfirmation,
    };
    this.profileService
      .updateProfile(body, this.decryptionService.GrabEnvironmentKey("mode"))
      .subscribe(
        () => {
          this.authService.logout();
          this.router.navigate(["/login"]).then();
          this.landaService.alertSuccess(
            "Berhasil",
            "Berhasil mengubah password, silahkan login kembali"
          );
        },
        (error) => {
          Swal.fire("Gagal", error.error.message, "error").then();
        }
      );
  }

  submitEditProfile() {
    if (this.isKeycloak) {
      if (this.Fullname == "") {
        Swal.fire(
          "Terjadi Kesalahan",
          "Nama lengkap harus diisi!",
          "error"
        ).then();
      } else {
        let array = this.Fullname.split(" ");
        this.keycloakProfile.firstName = array[0];
        this.keycloakProfile.lastName =
          array.length > 1 ? array.slice(1, array.length).join(" ") : "[-]";
        this.authService.updateProfileKeycloak(this.keycloakProfile).subscribe(
          (res: any) => {
            this.authService.closeOidc();
            this.router.navigate(["/login"]).then();
            this.landaService.alertSuccess(
              "Berhasil",
              "Berhasil mengubah profil, silahkan login kembali"
            );
          },
          (error) => {
            Swal.fire("Gagal", error.error.message, "error").then();
          }
        );
      }
    } else {
      const body = {
        Fullname: this.Fullname,
        Email: this.Email,
      };
      this.profileService
        .updateProfile(body, this.decryptionService.GrabEnvironmentKey("mode"))
        .subscribe(
          () => {
            this.authService.logout();
            this.router.navigate(["/login"]).then();
            this.landaService.alertSuccess(
              "Berhasil",
              "Berhasil mengubah profil, silahkan login kembali"
            );
          },
          (error) => {
            Swal.fire("Gagal", error.error.message, "error").then();
          }
        );

      //saas update email terpisah
      this.profileService
        .updateEmail(body, this.decryptionService.GrabEnvironmentKey("mode"))
        .subscribe(() => {
          console.log("success update email");
        });
    }
  }

  triggerInputProfilePhoto() {
    document?.getElementById("ProfilePhoto")?.click();
  }

  uploadPhoto(event : any) {
    const file = event.target.files[0];
    console.log(file);
    // this.photoProfile = this.photoProfile.substr(22);
    this.authService.uploadProfilePhoto(file).subscribe(
      () => {
        this.landaService.alertSuccess(
          "Berhasil",
          "Berhasil mengubah foto profil"
        );
      },
      (error) => {
        Swal.fire("Gagal", error.error.message, "error").then();
      }
    );
  }

  getProfileKeycloak() {
    this.authService.getProfileKeycloak().subscribe((res: any) => {
      this.keycloakProfile = res;
      if (res.attributes?.Image?.length > 0) {
        this.photoProfile = res.attributes?.Image[0];
      }
      if (this.keycloakProfile.lastName == "[-]") {
        this.keycloakProfile.lastName = "";
      }
    });
  }

  changePasswordKeycloak() {
    window.location.href = this.decryptionService.GrabEnvironmentKey(
      "update_password_keycloak"
    );
  }
}
