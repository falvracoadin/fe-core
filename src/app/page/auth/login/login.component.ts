import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { LoaderService } from '../../../core/service/loader.service';
import { AuthService } from '../../../core/service/auth.service';

import Swal from 'sweetalert2';

import { UserModel } from '../../../core/model/user.model';
import { ToasterService } from 'src/app/core/service/toast.service';
import { PermissionsService } from '../../../core/service/permissions.service';
import { RsaService } from '../../../core/service/rsa.service';
import { DecryptionService } from '../../../core/service/decryption.service';
// import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
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
  }

  signKey() {
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
      this.loginForm.controls['Password'].setErrors({ invalid: true });
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

  loginSSO() {
    this.isSSOClicked = true;
    this.loaderService.show();
    const redirect = this.decryptionService.GrabEnvironmentKey("baseUrl") + "/oidc"
    console.log(redirect)
    this.authService.initOidc().subscribe((res : any) => {
      const data : {url : string, type : string} = res.data
      data.url += "&redirect_uri=" + encodeURIComponent(redirect)
      const height = 500
      const width = 500
      const left = (window.innerWidth - width) / 2
      const top = (window.innerHeight - height) /2
      const newWindow = window.open(data.url, data.type, `fullscreen=0,height=${height},left=${left},width=${width},location=0,menubar=0,resizable=0,status=0,toolbar=0,top=${top}`);
      newWindow?.focus()
      const checkAuth = setInterval(() => {
        if(newWindow?.closed){
          this.isSSOClicked = false;
          this.loaderService.hide();
          if(this.authService.GetToken().Token){
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
  }
  
}
