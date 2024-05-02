import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";

import { DecryptionService } from "../../../../core/services/decryption.service";

import Swal from 'sweetalert2';

import { LandaService } from "src/app/core/services/landa.service";
import { Md5 } from "ts-md5";
import { AuthService } from "../../services/auth.service";
// import { OidcSecurityService } from "angular-auth-oidc-client";
import { LoaderService } from "src/app/core/services/loader.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  passwordStatus!: {
    status: boolean;
    message: string;
    color: string;
  };
  showPassword = false;
  errorAlert = false;
  successAlert = false;
  alertMessage = "";
  errCode = 0;
  loginForm : any = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });
  tooManyRequest = false;
  countdown = 0;
  dataLocal: any;
  dataAlert: any;

  authMode: string = "";
  isKeycloak: boolean = true;
  isSSOClicked: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private landaService: LandaService,
    private loaderService: LoaderService,
    private decryptionService: DecryptionService,
    // private oidcSecurityService: OidcSecurityService
  ) { }

  ngOnInit(): void {
    // this.authMode = this.decryptionService.GrabEnvironmentKey("mode");
    // this.isKeycloak = this.authMode == "keycloak" ? true : false;
    // if (this.isKeycloak) {
    //   this.oidcSecurityService.checkAuth().subscribe((auth) => {
    //     console.log("App Login Auth", auth);
    //     if (auth) {
    //       let token = this.oidcSecurityService.getToken();
    //       this.authService.saveToken(token).then();
    //       this.authService.saveUserLogin(this.authMode);
    //       this.authService.savePermission();
    //       setTimeout(() => {
    //         this.router.navigate(["/home"]);
    //       }, 1000);
    //     } else {
    //       this.authService.logout();
    //       this.router.navigate(["/login"]);
    //     }
    //   });
    // }
    // this.authService.getPasswordStatus().subscribe((res: any) => {
    //   this.passwordStatus = {
    //     status: res,
    //     message: "Password telah diganti!",
    //     color: "success",
    //   };
    // });
    // // Check for token and navigate in ngOnInit
    // if (this.authService.getToken() !== "") {
    //   this.router.navigate(["/dashboard"]).then();
    // }
  }

  login() {
    if (this.isKeycloak) {
      this.isSSOClicked = true;
      this.loaderService.show();
      const baseUrl = this.decryptionService.GrabEnvironmentKey("baseUrl");
      const redirect = baseUrl + "/oidc"
      console.log(redirect)
      this.authService.initOidc().subscribe((res: any) => {
        const data: { url: string, type: string } = res.data
        data.url += "&redirect_uri=" + encodeURIComponent(redirect)
        const height = 500
        const width = 500
        const left = (window.innerWidth - width) / 2
        const top = (window.innerHeight - height) / 2
        const newWindow = window.open(data.url, data.type, `fullscreen=0,height=${height},left=${left},width=${width},location=0,menubar=0,resizable=0,status=0,toolbar=0,top=${top}`);
        newWindow?.focus()
        const checkAuth = setInterval(() => {
          if (newWindow?.closed) {
            this.isSSOClicked = false;
            this.loaderService.hide();
            if (this.authService.getToken().Token) {
              Swal.fire({
                icon: 'success',
                text: 'Berhasil Login',
                showConfirmButton: false,
                timer: 3500,
              }).then();
              setTimeout(() => {
                this.router.navigate(['/dashboard']).then()
              }, 2000);
            }
            clearInterval(checkAuth)
          }
        }, 1000)
      })
    } else {
      switch (this.authMode) {
        case "saas": {
          this.authService.initSaas().subscribe(async (dataInit: any) => {
            localStorage.setItem("platformKey", dataInit.Data.Platformkey);
            this.authService
              .loginSaas(
                this.loginForm.value.email,
                this.loginForm.value.password,
                dataInit.Data.Platformkey
              )
              .subscribe(
                async (res: any) => {
                  //split name from email
                  const nameSplit = this.loginForm.value.email.split("@")[0];

                  // hit create or update saas
                  const payloadCreate = {
                    Email: this.loginForm.value.email,
                    Fullname: nameSplit,
                    Token: res.Data.Token,
                  };
                  this.authService
                    .CreateOrUpdateMemberSaas(payloadCreate)
                    .subscribe(
                      (res) => { },
                      (error) => {
                        console.error(error);
                      }
                    );

                  this.authService.saveToken(res.Data.Token).then();
                  this.authService.saveUserLogin(
                    this.authMode,
                    dataInit.Data.Platformkey
                  );
                  this.authService.savePermission();
                  this.landaService.alertSuccess("Success", "Berhasil Login !");
                  setTimeout(() => {
                    this.router.navigate(["/dashboard"]).then();
                  }, 1000);
                },
                (err: any) => {
                  this.errorAlert = true;
                  // this.errCode = err.error.code;
                  this.errCode = err.error.StatusCode;
                  if (err.error.code === 429) {
                    this.tooManyRequest = true;
                    this.countdown = err.error.data.RetryAfter;
                    let countdown: string;

                    if (this.countdown >= 3600) {
                      countdown = new Date(this.countdown * 1000)
                        .toISOString()
                        .substr(11, 8);
                    } else {
                      countdown = new Date(this.countdown * 1000)
                        .toISOString()
                        .substr(14, 5);
                    }

                    this.alertMessage = this.dataLocal.limit + " " + countdown;
                    const interval = setInterval(() => {
                      this.countdown--;

                      if (this.countdown >= 3600) {
                        countdown = new Date(this.countdown * 1000)
                          .toISOString()
                          .substr(11, 8);
                      } else {
                        countdown = new Date(this.countdown * 1000)
                          .toISOString()
                          .substr(14, 5);
                      }

                      this.alertMessage =
                        this.dataLocal.limit + " " + countdown;
                      if (this.countdown === 0) {
                        clearInterval(interval);
                        this.tooManyRequest = false;
                        this.errorAlert = false;
                      } else if (this.countdown < 0) {
                        clearInterval(interval);
                        this.tooManyRequest = false;
                        this.errorAlert = false;
                      } else {
                        this.alertMessage =
                          this.dataLocal.limit + " " + countdown;
                      }
                    }, 1000);
                  } else {
                    // this.alertMessage = this.dataLocal.error_log;
                    this.alertMessage = err.error.Message;
                  }
                }
              );
          });
          break;
        }
        default: {
          this.authService.login(this.loginForm.value).subscribe(
            (res: any) => {
              if (res.code === 202) {
                const log = Md5.hashStr(
                  this.loginForm.value.email + this.loginForm.value.password
                ).toString();
                const pattr = res.data.Signature;
                const lastPattern = pattr.substring(
                  0,
                  Math.floor(pattr.length / 2)
                );
                const firstPattern = pattr.substring(
                  Math.floor(pattr.length / 2),
                  pattr.length
                );
                const newPattr = firstPattern + lastPattern;
                if (log === newPattr) {
                  localStorage.setItem("user", res.data.Token);
                  this.authService.saveUserLogin();
                  this.authService.savePermission();
                  this.authService.setPasswordStatus(false);
                  this.landaService.alertSuccess("Success", "Berhasil Login !");
                } else {
                  return this.landaService.alertError(
                    "Gagal",
                    "Gagal Login, Coba Lagi !"
                  );
                }

                setTimeout(() => {
                  this.router.navigate(["/dashboard"]).then();
                }, 1000);
              }
            },
            (err: any) => {
              this.errorAlert = true;
              if (err.error.code === 429) {
                this.tooManyRequest = true;
                this.countdown = err.error.data.RetryAfter;
                let countdown: string;

                if (this.countdown >= 3600) {
                  countdown = new Date(this.countdown * 1000)
                    .toISOString()
                    .substr(11, 8);
                } else {
                  countdown = new Date(this.countdown * 1000)
                    .toISOString()
                    .substr(14, 5);
                }

                this.alertMessage = this.dataLocal.limit + " " + countdown;
                const interval = setInterval(() => {
                  this.countdown--;

                  if (this.countdown >= 3600) {
                    countdown = new Date(this.countdown * 1000)
                      .toISOString()
                      .substr(11, 8);
                  } else {
                    countdown = new Date(this.countdown * 1000)
                      .toISOString()
                      .substr(14, 5);
                  }

                  this.alertMessage = this.dataLocal.limit + " " + countdown;
                  if (this.countdown === 0) {
                    clearInterval(interval);
                    this.tooManyRequest = false;
                    this.errorAlert = false;
                  } else if (this.countdown < 0) {
                    clearInterval(interval);
                    this.tooManyRequest = false;
                    this.errorAlert = false;
                  } else {
                    this.alertMessage = this.dataLocal.limit + " " + countdown;
                  }
                }, 1000);
              } else {
                // this.alertMessage = this.dataLocal.error_log;
                this.alertMessage = "Email atau Password Salah !";
              }
            }
          );
        }
      }
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  reset() {
    this.passwordStatus = {
      status: false,
      message: "",
      color: "success",
    };
  }
}
