import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

import {LoaderService} from '../../../core/service/loader.service';
import {AuthService} from '../../../core/service/auth.service';

import Swal from 'sweetalert2';

import {UserModel} from '../../../core/model/user.model';
import {ToasterService} from 'src/app/core/service/toast.service';
import {PermissionsService} from '../../../core/service/permissions.service';
import {RsaService} from '../../../core/service/rsa.service';
import {DecryptionService} from '../../../core/service/decryption.service';
// import {LoginResponse, OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
    selector: 'app-login',
    templateUrl: './login.component2.html',
    styleUrls: ['./login.component2.css'],
})
export class LoginComponent2 implements OnInit {
    saasUrl = this.decryptionService.GrabEnvironmentKey('saasUrl');
    isKeycloak: boolean =
        this.decryptionService.GrabEnvironmentKey('authMode') == 'keycloak';

    loadingState = false;

    successAlert: boolean = false;

    dangerAlertFieldAccount: boolean = false;
    dangerAlertMessageAccount: boolean = false;
    dangerAlertField: boolean = false;
    dangerAlertMessage: boolean = false;

    message: string = '';
    messageAccount: string = '';

    showedPassword = false;

    loginForm = this.formBuilder.group({
        Email: ['', [Validators.required, Validators.email]],
        Password: [
            '',
            [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
        ],
    });

    isSSOClicked: boolean = false;

    isCaptchaReolved :boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private loaderService: LoaderService,
        private authService: AuthService,
        private router: Router,
        private toast: ToasterService,
        private permission: PermissionsService,
        private rsaService: RsaService,
        private decryptionService: DecryptionService,
        // private oidcSecurityService: OidcSecurityService
    ) {
        this.loaderService.isLoading.subscribe((showLoading) => {
            this.loadingState = showLoading;
        });
    }

    ngOnInit(): void {
        // if (this.decryptionService.GrabEnvironmentKey('authMode') == 'keycloak') {
        //     this.oidcSecurityService.checkAuth().subscribe((auth: LoginResponse) => {
        //         console.log('Login Comp Auth', auth);
        //         var test = {
        //             "keycloakAuthority": this.decryptionService.GrabEnvironmentKey('keycloakAuthority'),
        //             "keycloakClientId": this.decryptionService.GrabEnvironmentKey('keycloakClientId'),
        //             "keycloakUrl": this.decryptionService.GrabEnvironmentKey('keycloakUrl'),
        //             "apiUrlKeycloak": this.decryptionService.GrabEnvironmentKey('apiUrlKeycloak'),
        //             "updatePasswordKeycloak": this.decryptionService.GrabEnvironmentKey('updatePasswordKeycloak'),
        //         }

        //         console.log(test);
        //         if (auth.isAuthenticated) {
        //             // let token = this.oidcSecurityService.ge;
        //             // this.authService.saveToken(token).then();
        //             // this.authService.saveUserLogin();
        //             // this.authService.savePermission();
        //             // setTimeout(() => {
        //             //   const condition =
        //             //     this.location.path().includes("/auth") ||
        //             //     this.location.path().includes("/question") ||
        //             //     this.location.path().includes("/progress-submit-paspor");
        //             //   if (condition) {
        //             //     this.router.navigate(["/home"]);
        //             //   } else {
        //             //     this.router.navigate([this.location.path()]);
        //             //   }
        //             // }, 1000);
        //         } else {
        //             // console.log("NOT LOGGED IN");
        //             this.authService.Logout();
        //             this.router.navigate(['/login2']);
        //         }
        //     });
        // }
    }

    resolvedCaptcha(captchaResponse: string) {
        console.log(`Resolved captcha with response: ${captchaResponse}`);
        this.isCaptchaReolved = true;
    }

    signKey() {
        console.log('masuk');

        var text = {
            detail_transaction_page: {
                notified_via: [3],
                status: 1,
                product: [
                    {
                        amount_total: 10000,
                        category: 'zakatmaal',
                        city_id: null,
                        district_id: null,
                        is_hidden_name: false,
                        is_nominal: true,
                        is_pusat: true,
                        natura_id: null,
                        on_behalf_of: 'vg',
                        proof_of_payment: [
                            'https://s3.loyalto.id/81-staginglazisnu/staginglazisnu/EBpKVLZQ1701678210-54d92811b13a31d23989ccf65a8c5172.png',
                        ],
                        province_id: null,
                        quantity: 0,
                        variable: {},
                        ziswaf_product_id: 17,
                    },
                ],
            },
            donor_page: {
                address: 'Jl. Jalan No. 1',
                donors_type_id: 0,
                email: 'jalan@gmail.com',
                gender: 'laki-laki',
                name: 'testing',
                npwp: '08.178.554.2-123.322',
                npwz: '1223445467709',
                phone: '628938127381',
            },
            is_drafted: null,
            payment_page: {
                collected_via: 3,
                crm: 'CRM Update',
                date: '2023-12-04',
                payment_account: 1,
                payment_method: 1,
                proof_of_payment: null,
            },
        };

        var signature = this.rsaService.signMessage(text, true);

        var verify = this.rsaService.verifySignature(
            text,
            signature.toString(),
            true
        );

        console.log(signature, verify);
    }

    emptyAlert() {
        this.message = '';
        this.messageAccount = '';
        this.dangerAlertFieldAccount = false;
        this.dangerAlertMessageAccount = false;
        this.dangerAlertField = false;
        this.dangerAlertMessage = false;
    }

    onSubmit() {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,20}$/;

        if (!passwordRegex.test(this.loginForm.value.Password || '')) {
            this.loginForm.controls['Password'].setErrors({invalid: true});
            this.emptyAlert();
            // this.message = 'Masukkan password valid!';
            // this.successAlert = false;
            this.dangerAlertField = true;
            // this.dangerAlertMessage = true;
            this.toast.error('Masukkan password valid!', '');
            return;
        }

        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        } else {
            this.authService.Login(this.loginForm.value).subscribe(
                (loginRes: any) => {
                    console.log(loginRes);

                    // hit create or update saas
                    var payload = {
                        Email: loginRes.Data.Email,
                        Fullname: loginRes.Data.Fullname,
                        Token: loginRes.Data.Token,
                    };
                    this.authService.CreateOrUpdateMemberSaas(payload).subscribe(
                        (res) => {
                            console.log(res);
                        },
                        (error) => {
                            console.error(error);
                        }
                    );

                    let user: UserModel;
                    user = loginRes.Data;
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem(
                        'refreshTokenPayload',
                        JSON.stringify(this.parseJwt(user.RefreshToken))
                    );
                    localStorage.setItem(
                        'tokenPayload',
                        JSON.stringify(this.parseJwt(user.Token))
                    );

                    this.permission.GetPermission().subscribe((permissions: any) => {
                        this.permission.SetPermission(permissions);
                    });

                    Swal.fire({
                        icon: 'success',
                        text: loginRes.Message,
                        showConfirmButton: false,
                        timer: 1000,
                    }).then();

                    setTimeout(() => {
                        // this.router.navigate(['/dashboard']).then();
                        location.reload();
                    }, 1000);
                },
                (error) => {
                    if (error.status === 429) {
                        this.emptyAlert();
                        // this.messageAccount = 'Terlalu banyak percobaan, silahkan coba lagi nanti';
                        this.successAlert = false;
                        this.dangerAlertFieldAccount = true;
                        // this.dangerAlertMessageAccount = true;
                        this.dangerAlertField = true;
                        this.dangerAlertField = true;
                        this.toast.error(
                            'Terlalu banyak percobaan, silahkan coba lagi nanti',
                            ''
                        );
                    } else if (error.status === 401) {
                        this.emptyAlert();
                        // this.message = 'Password salah, coba lagi';
                        this.successAlert = false;
                        this.dangerAlertField = true;
                        // this.dangerAlertMessage = true;
                        this.toast.error('Email atau password salah', '');
                    } else {
                        this.emptyAlert();
                        // this.messageAccount = 'Email atau password salah';
                        this.successAlert = false;
                        this.dangerAlertFieldAccount = true;
                        // this.dangerAlertMessageAccount = true;
                        this.dangerAlertField = true;
                        this.toast.error('Email atau password salah', '');
                    }
                }
            );
        }
    }

    parseJwt(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    }

    // function to create or update Member Saas
    loginSSO() {

        if (!this.isCaptchaReolved){
          Swal.fire({
            icon: 'error',
            text: 'Silahkan Menyelesaikan Pengecekan Robot Terlebih Dahulu',
            showConfirmButton: true,
          }).then();
          return;
        }

        this.isSSOClicked = true;
        this.loaderService.show();
        // this.oidcSecurityService.authorizeWithPopUp().subscribe((auth) => {
        //     console.log('authorizedCallback', auth);
        //     this.isSSOClicked = false;
        //     this.loaderService.hide();
        //     if (auth.isAuthenticated) {
        //         let parsedToken = this.parseJwt(auth.accessToken);
        //         if (parsedToken.groups.includes('Admin Lazisnu')) {
        //             this.oidcSecurityService.getRefreshToken().subscribe((refresh) => {
        //                 var payload = {
        //                     Email: auth.userData.email,
        //                     Fullname: auth.userData.name,
        //                     Token: auth.accessToken,
        //                 };

        //                 this.authService.CreateOrUpdateMemberSaas(payload).subscribe(
        //                     (res) => {
        //                     },
        //                     (error) => {
        //                         console.error(error);
        //                     }
        //                 );

        //                 let name = '';
        //                 let nameFromKeycloak = auth.userData.name.split(' ');

        //                 if (nameFromKeycloak.includes('[-]')) {
        //                     name = nameFromKeycloak[0];
        //                 } else {
        //                     name = auth.userData.name;
        //                 }
        //                 let user: UserModel;
        //                 user = {
        //                     DeviceId: 'browser',
        //                     Email: auth.userData.email,
        //                     Fullname: name,
        //                     InstallId: 'web',
        //                     RefreshToken: refresh,
        //                     Status: 'active',
        //                     Token: auth.accessToken,
        //                 };
        //                 localStorage.setItem('user', JSON.stringify(user));
        //                 localStorage.setItem(
        //                     'refreshTokenPayload',
        //                     JSON.stringify(this.parseJwt(user.RefreshToken))
        //                 );
        //                 let parsedToken = this.parseJwt(user.Token);

        //                 let timestamp = parsedToken.exp * 1000;
        //                 let formattedDate = new Date(timestamp);

        //                 let tokenPayload = {
        //                     ClientId: parsedToken.ClientId,
        //                     Email: parsedToken.email,
        //                     Expired: formattedDate,
        //                     Fullname: name,
        //                     Permission: parsedToken.groups,
        //                     Phone: '',
        //                     PlatformScope: 'public',
        //                     Source: 'platform',
        //                     UserId: parsedToken.UserId,
        //                     Username: parsedToken.email,
        //                     Image: parsedToken.Image,
        //                 };

        //                 localStorage.setItem('tokenPayload', JSON.stringify(tokenPayload));

        //                 this.permission.GetPermission().subscribe((permissions: any) => {
        //                     this.permission.SetPermission(permissions);
        //                 });

        //                 Swal.fire({
        //                     icon: 'success',
        //                     text: 'Berhasil Login',
        //                     showConfirmButton: false,
        //                     timer: 1000,
        //                 }).then();

        //                 setTimeout(() => {
        //                     // this.router.navigate(['/dashboard']).then();
        //                     location.reload();
        //                 }, 1000);
        //             });
        //         } else {
        //             Swal.fire({
        //                 icon: 'error',
        //                 text: 'Anda tidak memiliki akses ke aplikasi ini',
        //                 showConfirmButton: false,
        //                 timer: 1000,
        //             }).then();
        //             this.authService.logoutKeycloak();
        //         }
        //     }
        // });
    }
}
