import { Component, OnInit } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './core/service/auth.service';
import { DecryptionService } from './core/service/decryption.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isKeycloak: boolean =
    this.decryptionService.GrabEnvironmentKey('authMode') === 'keycloak'
      ? true
      : false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private bnIdle: BnNgIdleService,
    private decryptionService: DecryptionService,
  ) {}

  ngOnInit() {
    const countAutoLogout =
      this.decryptionService.GrabEnvironmentKey('countAutoLogout');
    const idleTimeout =
      this.decryptionService.GrabEnvironmentKey('idleTimeout');
    const userLogin = this.authService.getProfileFromLocalStorage();

    let count = countAutoLogout;

    let interval: any;
    if (userLogin && this.decryptionService.GrabEnvironmentKey('idleMode')) {
      const idle = this.bnIdle
        .startWatching(idleTimeout)
        .subscribe((isTimedOut: boolean) => {
          if (isTimedOut) {
            interval = setInterval(() => {
              count--;
              if (count == 0) {
                clearInterval(interval);
                if (this.isKeycloak) {
                  this.authService.closeOidc()
                } else {
                  this.authService.Logout();
                }
                this.router.navigate(['/login']);
                this.bnIdle.stopTimer();
                Swal.close();
                idle.unsubscribe();
                return;
              }
            }, 1000);
          }

          Swal.fire({
            title: 'Apa kamu masih di sana?',
            text: 'Anda sudah tidak aktif selama beberapa waktu, apakah Anda ingin melanjutkan?',
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonColor: '#3ba269',
            confirmButtonText: 'Ya saya disini!',
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              count = countAutoLogout;
              clearInterval(interval);
              this.bnIdle.resetTimer();
              return;
            }
          });
        });
    }
  }
}
