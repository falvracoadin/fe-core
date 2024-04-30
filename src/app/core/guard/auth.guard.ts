import { CanActivateFn } from '@angular/router';

import { Router } from "@angular/router";

export const AuthGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('user') || "{}");

    return user.Token === undefined;
  }

  const router = new Router();

  if (isLoggedIn()) {
    router.navigate(['/login']).then();
    return false;
  }

  return true;
};

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('user') || "{}");

    return user.Token === undefined;
  }

  const router = new Router();

  if (!isLoggedIn()) {
    router.navigate(['/dashboard']).then();
    return false;
  }
  if(window.location.pathname == "/oidc"){
    console.log("from oidc")
    return true
  }
  
  return true;
};
