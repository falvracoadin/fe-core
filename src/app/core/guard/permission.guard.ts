import {CanActivateFn} from '@angular/router';

import {Router} from "@angular/router";
import Swal from 'sweetalert2';

declare type permissionGuardFunc = (permissionKey: string) => CanActivateFn

export const PermissionGuard: permissionGuardFunc = (permissionKey: string) => {
  return async (route, state) => {

    const listPermission: any [] = JSON.parse(localStorage.getItem('permissions') || '[]')

    var arrKey = permissionKey.split('|')
    var result = false
    if (arrKey.length > 1) {
      arrKey.forEach((key: any) => {
        if (listPermission.includes(key)) {
          result = true
        }
      });
      if (result) {
        return true
      }
      window.location.href = "/dashboard"
      return false
    } else {
      result = listPermission.includes(permissionKey);
      if (result) {
        return true
      }
      window.location.href = "/dashboard"
      return false
    }
  }
}
