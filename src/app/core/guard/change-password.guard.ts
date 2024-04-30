import { CanMatchFn, CanActivateFn } from '@angular/router';

export const ChangePasswordGuard: CanActivateFn = (route, segments) => {
  return true;
};
