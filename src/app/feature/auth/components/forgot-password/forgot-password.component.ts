import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  resetEmailForm = new FormGroup({
    email: new FormControl(''),
    code: new FormControl('')
  });
  changePasswordForm = new FormGroup({
    passwordBaru: new FormControl(''),
    konfirmasiPasswordBaru: new FormControl(''),
    forgotKey: new FormControl('')
  });
  response!: {
    status: boolean;
    message: string;
    color: string;
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.getToken() !== null) {
      this.router.navigate(['/user']).then();
    }
  }

  page = 'main';
  errorAlert = false;
  successAlert = false;
  alertMessage = '';
  showPasswordBaru = false;
  showKonfirmasPasswordBaru = false;
  tooManyRequest = false;
  countdown = 0;

  ngOnInit(): void {
    this.changePasswordForm.patchValue({
      forgotKey: this.route.snapshot.queryParams['key']
    })
    this.response = {
      status: false,
      message: '',
      color: '',
    };
  }

  closeAlert() {
    this.response = {
      status: false,
      message: '',
      color: '',
    };
  }

  createCode(size: number): string {
    const prt = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()_+;,./<>?|`~~"
    let result = '';
    for (let i = 0; i < size; i++) {
      const rand = Math.ceil(Math.random() * prt.length)
      result += prt.charAt(rand)
    }
    return result
  }

  countDown() {
    var countdown: string;

    if (this.countdown >= 3600) {
      countdown = new Date(this.countdown * 1000).toISOString().substr(11, 8);
    } else {
      countdown = new Date(this.countdown * 1000).toISOString().substr(14, 5);
    }

    return countdown
  }

  send() {
    const code = this.createCode(20)
    this.resetEmailForm.patchValue({
      code: code
    })
    this.authService.forgotPassword(this.resetEmailForm.value).subscribe(
      (res: any) => {
        if (res.code == 201) {
          let log = Md5.hashStr(code + this.resetEmailForm.value.email).toString()
          let pattr = res.data.signature
          let lastPattern = pattr.substring(0, Math.floor((pattr.length) / 2));
          let firstPattern = pattr.substring(Math.floor((pattr.length) / 2), pattr.length);
          let newPattr = firstPattern + lastPattern;
          if (log == newPattr) {
            this.response = {
              status: true,
              message: "Instruksi reset password berhasil dikirim!",
              color: "success",
            }
          } else {
            this.response = {
              status: true,
              message: "Instruksi reset password gagal dikirim!",
              color: "danger",
            }
          }
        } else {
          this.response = {
            status: true,
            message: res.message,
            color: "danger",
          }
        }
      },
      (err: any) => {
        if (err.error.code == 429) {
          this.tooManyRequest = true;
          this.countdown = err.error.data.RetryAfter;
          let countdown: string;

          countdown = this.countDown()

          this.response = {
            status: true,
            message: `Terlalu banyak permintaan masuk, silahkan coba lagi dalam ${countdown}`,
            color: "danger",
          }
          const interval = setInterval(() => {
            this.countdown--;

            countdown = this.countDown()

            this.response = {
              status: true,
              message: `Terlalu banyak permintaan masuk, silahkan coba lagi dalam ${countdown}`,
              color: "danger",
            }
            if (this.countdown === 0) {
              clearInterval(interval);
              this.response = {
                status: false,
                message: "",
                color: "",
              }
            } else if (this.countdown < 0) {
              clearInterval(interval);
              this.response = {
                status: false,
                message: "",
                color: "",
              }
            } else {
              this.response = {
                status: true,
                message: `Terlalu banyak permintaan masuk, silahkan coba lagi dalam ${countdown}`,
                color: "danger",
              }
            }
          }, 1000);
        } else {
          this.response = {
            status: true,
            message: err.error.message,
            color: "danger",
          }
        }
      }
    );
  }

  sendChangePassword() {
    if (this.changePasswordForm.value.passwordBaru !== this.changePasswordForm.value.konfirmasiPasswordBaru) {
      this.alertMessage = "Konfirmasi password tidak sama!";
      this.errorAlert = true;
    } else {
      this.authService.changePassword(this.changePasswordForm).subscribe((res: any) => {
        this.successAlert = true
        this.errorAlert = false
        this.alertMessage = "Password berhasil diubah!"
        localStorage.setItem('statusPw', 'true');
        localStorage.setItem('msgPw', 'Password Berhasil Diubah')
        window.location.href = window.location.origin
        this.router.navigate(['/login']).then();
      }, (err: any) => {
        this.errorAlert = true
        this.alertMessage = err.error.message
      })
    }
  }
}
