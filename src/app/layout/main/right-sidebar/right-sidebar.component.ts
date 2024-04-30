import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { AuthService } from '../../../core/service/auth.service';
import { LoaderService } from '../../../core/service/loader.service';

import { TokenModel } from '../../../core/model/user.model';
import { DecryptionService } from 'src/app/core/service/decryption.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
})
export class RightSidebarComponent implements OnChanges, OnInit {
  @Input() rightSidebarOpen: boolean = false;

  @Output() rightSidebarOpenChange = new EventEmitter<boolean>();

  dangerAlert: boolean = false;
  errorMessage: string = '';

  page: string = 'main';

  loadingState = false;

  profile: TokenModel = this.authService.GetTokenPayload();

  editProfileForm = this.formBuilder.group({
    Fullname: [this.profile.Fullname, Validators.required],
    Fistname: [this.profile.Fullname, Validators.required],
    Lastname: [this.profile.Fullname, Validators.required],
  });

  changePasswordForm = this.formBuilder.group({
    OldPassword: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    NewPassword: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    NewPasswordConfirmation: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  showOldPassword = false;
  showNewPassword = false;
  showPasswordConfirmation = false;

  isKeycloak: boolean =
    this.decryptionService.GrabEnvironmentKey('authMode') === 'keycloak'
      ? true
      : false;

  keycloakProfile: any;

  constructor(
    private loaderService: LoaderService,
    private authService: AuthService,
    private decryptionService: DecryptionService,
    private formBuilder: FormBuilder
  ) {
    this.loaderService.isLoading.subscribe((showLoading) => {
      this.loadingState = showLoading;
    });
  }

  ngOnInit(): void {
    if (this.isKeycloak) {
      this.getProfileKeycloak();
    }
  }

  ngOnChanges() {
    if (this.rightSidebarOpen) {
      this.page = 'main';
      this.changePasswordForm.reset();
      this.profile = this.authService.GetTokenPayload();
    }
  }

  toggleRightSidebarOpen() {
    this.rightSidebarOpenChange.emit(!this.rightSidebarOpen);
  }

  logOut() {
    if (this.isKeycloak) {
      // this.authService.logoutKeycloak();
      this.authService.closeOidc()
    } else {
      this.authService.Logout();
    }
  }

  onSubmitEditProfileForm() {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();
      return;
    } else {
      if (this.isKeycloak) {
        if (
          this.editProfileForm.value.Fullname != null &&
          this.editProfileForm.value.Fullname != ''
        ) {

          this.keycloakProfile.firstName = this.editProfileForm.value.Fistname?.trim();
          this.keycloakProfile.lastName = this.editProfileForm.value.Lastname?.trim();
          this.profile.Fullname = `${this.editProfileForm.value.Fistname} ${this.editProfileForm.value.Lastname}`

          this.authService
            .updateProfileKeycloak(this.keycloakProfile)
            .subscribe(
              (res: any) => {
                this.authService
                  .getProfileKeycloak()
                  .subscribe((getProfile: any) => {
                    this.keycloakProfile = getProfile;
                  });
                this.authService.SetTokenPayload(this.profile);
                Swal.fire({
                  icon: 'success',
                  text: 'Profil berhasil diubah',
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.page = 'main';
              },
              (error) => {
                console.log(error);
              }
            );
        } else {
        }
      } else {
        this.authService
          .EditProfile(this.editProfileForm.value)
          .subscribe((res: any) => {
            if (res.StatusCode === 200) {
              this.profile.Fullname = this.editProfileForm.value.Fullname || '';
              this.authService.SetTokenPayload(this.profile);
              Swal.fire({
                icon: 'success',
                text: 'Profil berhasil diubah',
                showConfirmButton: false,
                timer: 1500,
              });
              this.page = 'main';
            }
          });
      }
    }
  }

  sendErrorMessage(message: string) {
    this.errorMessage = message;
    this.dangerAlert = true;
  }

  onSubmitChangePasswordForm() {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,20}$/;

    if (!passwordRegex.test(this.changePasswordForm.value.OldPassword || '')) {
      this.sendErrorMessage('Password lama tidak valid');
      this.changePasswordForm.controls['OldPassword'].setErrors({
        invalid: true,
      });
    }

    if (!passwordRegex.test(this.changePasswordForm.value.NewPassword || '')) {
      this.sendErrorMessage('Password baru tidak valid');
      this.changePasswordForm.controls['NewPassword'].setErrors({
        invalid: true,
      });
    }

    if (
      !passwordRegex.test(
        this.changePasswordForm.value.NewPasswordConfirmation || ''
      )
    ) {
      this.sendErrorMessage('Konfirmasi password baru tidak valid');
      this.changePasswordForm.controls['NewPasswordConfirmation'].setErrors({
        invalid: true,
      });
    }

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    } else {
      if (
        this.changePasswordForm.value.NewPassword !==
        this.changePasswordForm.value.NewPasswordConfirmation
      ) {
        this.sendErrorMessage(
          'Password baru dan konfirmasi password baru tidak sama'
        );
        return;
      } else {
        this.authService
          .ChangePassword(this.changePasswordForm.value)
          .subscribe(
            (res: any) => {
              if (res.StatusCode === 200) {
                this.changePasswordForm.reset();
                Swal.fire({
                  icon: 'success',
                  text: 'Password berhasil diubah, silahkan login kembali',
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.authService.Logout();
              }
            },
            (err: any) => {
              if (err.status === 400) {
                this.sendErrorMessage('Password lama salah');
              }
            }
          );
      }
    }
  }

  getProfileKeycloak() {
    this.authService.getProfileKeycloak().subscribe((res: any) => {
      this.keycloakProfile = res;
      this.editProfileForm.controls['Fistname'].setValue(res.firstName);
      this.editProfileForm.controls['Lastname'].setValue(res.lastName);
      if (res.attributes?.Image?.length > 0) {
        this.profile.Image = res.attributes?.Image[0];
      }
    });
  }

  changePasswordKeycloak() {
    window.location.href = this.decryptionService.GrabEnvironmentKey(
      'updatePasswordKeycloak'
    );
  }
}
