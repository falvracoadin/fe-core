import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";

import { LoaderService } from "../../../core/service/loader.service";
import { AuthService } from "../../../core/service/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  loadingState = false;

  successAlert: boolean = false;
  dangerAlert: boolean = false;

  message: string = '';

  forgotPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {
    this.loaderService.isLoading.subscribe((showLoading) => {
      this.loadingState = showLoading;
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    } else {
      this.authService.ForgotPassword(this.forgotPasswordForm.value).subscribe((forgotPasswordRes: any) => {
        this.message = 'Instruksi berhasil dikirim';
        this.dangerAlert = false;
        this.successAlert = true;
        this.forgotPasswordForm.reset();
      }, (error) => {
        this.message = 'Email tidak ditemukan';
        this.successAlert = false;
        this.dangerAlert = true;
      });
    }
  }
}
