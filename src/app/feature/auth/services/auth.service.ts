import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StateService } from "src/app/core/services/state.service";
import { LandaService } from "../../../core/services/landa.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DecryptionService } from "../../../core/services/decryption.service";
// import { OidcSecurityService } from "angular-auth-oidc-client";

import { UserModel } from "src/app/core/model/user.model";
import { Router } from "@angular/router";

//define user model
class UserLocal {
  Email !: string;
  Expired!: string;
  Fullname!: string;
  Permission!: string[];
  Phone!: string;
  PlatformScope!: string;
  Source!: string;
  Username!: string;
}

class Role {
  supervisor!: boolean;
  operator!: boolean;
  superadmin!: boolean;
  rekonsile!: boolean;
  jasmed!: boolean;
}

const initialState = {
  userLogin: {
    id: "",
    nama: "",
    email: "",
    user_profile: "",
  },
};

@Injectable({
  providedIn: "root",
})
export class AuthService extends StateService<any> {
  httpOptions: any;
  userLogin: Observable<any> = this.select((state) => state.userLogin);
  mode: string = "";

  constructor(
    private landaService: LandaService,
    private router: Router,
    // private oidcSecurityService: OidcSecurityService,
    private decryptionService: DecryptionService
  ) {
    super(initialState);
    this.mode = this.decryptionService.GrabEnvironmentKey("mode");
  }

  saasUrl = this.decryptionService.GrabEnvironmentKey("saasUrl");
  apiUrl = this.decryptionService.GrabEnvironmentKey("apiURL");

  /**
   * Check if user has access to feature
   */
  checkAccess(access: string) {
    let userLogin: any;
    this.getProfile().subscribe((user: any) => (userLogin = user));
    if (userLogin.id === "") {
      return false;
    }

    const permission = access.split("|");
    for (const val of permission) {
      const exp = val.split(".");
      const feature = exp?.[0] ?? "-";
      const activity = exp?.[1] ?? "-";

      if (
        userLogin?.access?.[feature]?.[activity] &&
        userLogin.access[feature][activity] === true
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Request login
   */
  login(credentials: any) {
    return this.landaService.DataPost("/access/login/web", {
      Email: credentials.email,
      Password: credentials.password,
      Source: "web",
    });
  }

  loginSaas(email : any, password: any, platformKey: any) {
    return this.landaService.DataPost(
      "/access/v2/login/app",
      {
        Email: email,
        Password: password,
        InstallId: "web",
        DeviceId: "browser",
        DeviceType: "web",
        DeviceBrand: "-",
        DeviceModel: "-",
        Location: "-",
        IP: "173.8.8.8",
      },
      false,
      "saas",
      {
        Platformkey: platformKey,
      }
    );
  }

  initSaas() {
    return this.landaService.DataPost(
      "/access/v2/initialization",
      {
        Platform: this.decryptionService.GrabEnvironmentKey("platform"),
        Secret: this.decryptionService.GrabEnvironmentKey("secret"),
      },
      false,
      this.decryptionService.GrabEnvironmentKey("mode")
    );
  }

  ForgotPassword(email:any, code: any = "", mode : any = null) {
    if (mode == "saas") {
      return this.landaService.DataPost(
        "/access/v2/forgot-password/initial",
        {
          Email: email,
        },
        false,
        mode
      );
    }
    return this.landaService.DataPost("/access/forgot-password/initial", {
      Email: email,
      Code: code,
    });
  }

  saveNewPassword(data : any) {
    return this.landaService.DataPost("/access/forgot-password/validation", {
      NewPassword: data.password,
      NewPasswordConfirmation: data.passwordNew,
      ForgotKey: data.forgotKey,
    });
  }

  /**
   * Ambil token CSRF dari server dan simpan di localStorage
   */
  saveCsrf() {
    this.landaService.DataGet("/v1/auth/csrf").subscribe((res: any) => {
      return new Promise((resolve) => {
        localStorage.setItem("csrf", res.data);
        resolve(true);
      });
    });
  }

  /**
   * Ambil token CSRF dari localStorage
   */
  getCsrf() {
    const token = localStorage.getItem("csrf");
    if (token) {
      return token;
    }

    return "";
  }

  /**
   * Logout
   */
  logout() {
    this.removeToken().then();
    this.setState({
      userLogin: {
        id: "",
        nama: "",
        email: "",
        user_profile: "",
      },
    });
  }

  // logoutKeycloak() {
  //   this.logout();
  //   this.oidcSecurityService.logoff((url) => {
  //     window.location.href = url;
  //   });
  // }

  /**
   * Ambil profile user yang login dari state management
   */
  getProfile() {
    return this.select((state) => state.userLogin);
    // console.log(this.select(state => state.userLogin));
  }

  /**
   * Ambil user yang login ke server
   * dan simpan di RxJS
   */
  saveUserLogin(mode : any = null, platformKey :any = null) {
    // return this.landaService.DataGet('/access/profile/get').subscribe((res: any) => {
    //     this.setState({ userLogin: res.data });
    // });

    // test local private -------------------------------------------------------------

    if (mode == "keycloak") {
      return this.getProfileKeycloak().subscribe((user: any) => {
        let image = "";
        if (user.attributes?.Image?.length > 0) {
          image = user.attributes?.Image[0];
        }
        this.setState({
          userLogin: {
            Id: 900,
            Fullname:
              user.firstName +
              (user.lastName == "[-]" ? "" : ` ${user.lastName}`),
            Email: user.email,
            ProfileImage: image,
          },
        });
      });
    }

    if (mode == "saas") {
      return this.landaService
        .DataGet("/access/v2/platform/profile/detail", null, mode, {
          Platformkey: platformKey,
        })
        .subscribe(
          (res: any) => {
            this.setState({ userLogin: res.Data });
            localStorage.setItem("userProfile", JSON.stringify(res.Data));
          },
          (err) => {
            localStorage.clear();
          }
        );
    }
    return this.landaService
      .DataGet("/access/profile/get")
      .subscribe((res: any) => {
        this.setState({ userLogin: res.data });
      });
  }

  /** Simpan token user ke localstorage */
  saveToken(payload: any) {
    return new Promise((resolve) => {
      localStorage.setItem("user", payload);
      resolve(true);
    });
  }

  /**
   * Hapus user dari local Storage
   */
  removeToken() {
    return new Promise((resolve) => {
      // localStorage.removeItem("user");
      // localStorage.removeItem("permission-ntt");
      localStorage.clear();
      this.router.navigate(["/login"]);
      resolve(true);
    });
  }

  getUserRole(): Role {
    let saCheck = "";
    let spCheck = "";
    let opCheck = "";

    switch (this.mode) {
      case "saas":
        saCheck = "Admin:Superadmin";
        spCheck = "Admin:Supervisor";
        opCheck = "Admin:Operator";
        break;
      case "keycloak":
        saCheck = "SuperAdmin Health";
        spCheck = "Supervisor Health";
        opCheck = "Operator Health";
        break;
      default:
        saCheck = "Web:AdjAdmin:All";
        spCheck = "Web:AdjSp:All";
        opCheck = "Web:AdjOps:All";
        break;
    }

    let role: Role ={
      supervisor : false,
      operator : false,
      superadmin : false,
      rekonsile : false,
      jasmed : false,
    };
    // const permission = localStorage.getItem("permission-ntt");
    // const parsePermission = JSON.parse(permission);

    //
    // if (permission) {
    //   const superA = parsePermission.find((p) => p === saCheck);
    //   const superV = parsePermission.find((p) => p === spCheck);
    //   const oprtr = parsePermission.find((p) => p === opCheck);
    //   role = {
    //     supervisor: !!superV,
    //     operator: !!oprtr,
    //     superadmin: !!superA,
    //   };
    // }

    //untuk keycloak konfigurasi terbaru
    var userLocal: UserLocal = this.getProfileFromLocalStorage();

    //check group
    if (userLocal.Permission) {
      role = {
        supervisor: userLocal.Permission.includes(
          "HealthWebAdminAdjudicatorKTPSupervisor"
        ),
        operator: userLocal.Permission.includes(
          "HealthWebAdminAdjudicatorKTPOperator"
        ),
        superadmin: userLocal.Permission.includes("HealthWebAdminSuperAdmin"),
        jasmed: userLocal.Permission.includes("HealthWebAdminSuperAdminJasmed"),
        rekonsile: userLocal.Permission.includes("HealthWebAdminReconsile"), //todo -> tunggu group pasti dari atasan
      };
    }
    return role;
  }

  getActiveRole(): string {
    const roles : any = this.getUserRole();
    let activeRole = "";

    Object.keys(roles).map((key) => {
      if (roles[key]) {
        activeRole = key;
        return;
      }
    })

    return activeRole;
  }

  getProfileFromLocalStorage(): UserLocal {
    const tokenPayload : any = localStorage.getItem("tokenPayload");
    const objToken = JSON.parse(tokenPayload);
    return objToken as UserLocal;
  }

  savePermission() {
    if (this.mode == "keycloak") {
      const token = this.getToken();
      if (token) {
        const base64Url = token.Token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            // tslint:disable-next-line:only-arrow-functions
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const account = JSON.parse(jsonPayload);
        if (
          account.groups === undefined ||
          !account.groups.includes("Admin Health")
        ) {
          // this.logoutKeycloak();
          return false;
        } else {
          localStorage.setItem(
            "permission-ntt",
            JSON.stringify(account.groups)
          );
          return true;
        }
      }
      return
    } else {
      const token = this.getToken();
      if (token) {
        const base64Url = token.Token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            // tslint:disable-next-line:only-arrow-functions
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const account = JSON.parse(jsonPayload);

        localStorage.setItem(
          "permission-ntt",
          JSON.stringify(account.Permission)
        );
      }
      return
    }
  }

  /**
   * Ambil token user dari localstorage
   */
  getToken(): UserModel {
    let user = localStorage.getItem("user");
    if (!user) {
      user = "{}";
    }

    return JSON.parse(user);
  }

  getProfilePhoto() {
    return this.landaService.DataGet("/profile-photo/list");
  }

  uploadProfilePhoto(photo: any) {
    this.httpOptions = {
      headers: {
        enctype: "multipart/form-data",
        // tslint:disable-next-line:max-line-length
        "App-Id": this.decryptionService.GrabEnvironmentKey("appId"),
      },
    };
    photo = new File([photo], "profile-photo.png", { type: "image/png" });

    return this.landaService.DataPost(
      "/profile-photo/list",
      { Photo: photo },
      true
    );
  }

  forgotPassword(credentials: any) {
    return this.landaService.DataPost("/access/forgot-password/initial", {
      Email: credentials.email,
      Code: credentials.code,
    });
  }

  changePassword(data: any) {
    return this.landaService.DataPost("/access/forgot-password/validation", {
      NewPassword: data.password,
      NewPasswordConfirmation: data.passwordNew,
      ForgotKey: data.forgotKey,
    });
  }

  /**
   * Ambil password status dari state management
   */
  getPasswordStatus() {
    return this.select((state) => state.passwordStatus);
  }

  /**
   * Set status = true
   * ketika change password
   */
  setPasswordStatus(bool : any) {
    this.setState({ passwordStatus: bool });
  }

  CreateOrUpdateMemberSaas(payload: any) {
    payload.InstallId = "web";
    payload.DeviceId = "browser";
    payload.DeviceType = "web";
    payload.Email = payload.Email.toLowerCase();
    payload.Fullname = payload.Fullname.toLowerCase();
    const headers = new HttpHeaders({
      Authorization: "Bearer " + payload.Token,
    });

    return this.landaService.DataPost("/saas/register/app", payload);
  }

  getProfileKeycloak() {
    return this.landaService.DataGetKeycloak("", null);
  }

  updateProfileKeycloak(payload : any) {
    return this.landaService.DataPostKeycloak("", payload, false);
  }

  processOidc(code: string, redirect: string) {
    return this.landaService.DataPost(
      "/oidc/process",
      {
        Code: code,
        RedirectUrl: redirect,
      },
      true,
      false
    );
  }

  initOidc() {
    return this.landaService.DataGet("/oidc/init");
  }

  closeOidc() {
    const redirect = this.decryptionService.GrabEnvironmentKey("baseUrl");
    const clientId =
      this.decryptionService.GrabEnvironmentKey("keycloakClientId");
    const keycloakUrl =
      this.decryptionService.GrabEnvironmentKey("keycloakAuthority");
    window.location.href =
      keycloakUrl +
      "/protocol/openid-connect/logout?post_logout_redirect_uri=" +
      encodeURIComponent(redirect) +
      "&client_id=" +
      clientId;
  }

  userInfoOidc() {
    const user = this.getToken();
    const refreshToken = localStorage.getItem("refreshToken");
    return this.landaService.DataPost(
      "/oidc/user-info",
      {
        AccessToken: user.Token,
        TokenType: user.TokenType,
        RefreshToken: refreshToken,
        Expiry: user.Expiry,
      },
      true,
      false
    );
  }
}
