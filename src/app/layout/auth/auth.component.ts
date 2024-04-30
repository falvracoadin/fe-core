import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  lottieOptions: AnimationOptions = {
    path: '/assets/image/auth/auth-decoration/login.json',
  };
}
