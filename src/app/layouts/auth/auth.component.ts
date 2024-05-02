import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../feature/auth/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
      private authService: AuthService,
      private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.authService.getToken() !== null) {
      this.router.navigate(['/user']).then();
    }
  }

  public throwTestError(): void {
    console.log('Sentry Test Error');
    throw new Error('Sentry Test Error');
  }


}
