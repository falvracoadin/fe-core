import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";

import { LoaderService } from "../../../core/service/loader.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  loadingState = false;

  successAlert: boolean = false;
  dangerAlert: boolean = false;

  message: string = '';

  showedPassword = false;
  showedPasswordConfirmation = false;

  changePasswordForm = this.formBuilder.group({
    password: ['', Validators.required],
    passwordConfirmation: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {
    this.loaderService.isLoading.subscribe((showLoading) => {
      this.loadingState = showLoading;
    });
  }

  onSubmit() {
  }
}
