import { Injectable } from '@angular/core';
import { VenturoService } from './venturo.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  listPerms: any = [];
  permissions: string[] = [];

  constructor(
    private venturoService: VenturoService,
  ) { }

  GetPermission() {
    return this.venturoService.DataGet('/roles/user');
  }

  SetPermission(Permissions: any) {
    localStorage.setItem('authPermissions', Permissions.data.roles);

    // check if array Permissions?.data?.roles_data
    this.listPerms = [];
    Permissions?.data?.roles_data.forEach((element: any) => {
      element?.permission?.forEach((element2: any) => {
        if (this.listPerms.includes(element2)) return;
        this.listPerms.push(element2);
      });
    });

    localStorage.setItem('permissions', JSON.stringify(this.listPerms));
  }

  hasPermission(key: string): boolean {
    if (this.listPerms.length === 0) {
      this.listPerms = JSON.parse(localStorage.getItem('permissions') || '[]');
    }

    // add avaiblity for multiple permission
    var arrKey = key.split('|');
    var result = false;
    if (arrKey.length > 1) {
      arrKey.forEach((key: any) => {
        if (this.listPerms.includes(key)) {
          result = true;
        }
      });
      return result;
    } else {
      return !!this.listPerms.includes(key);
    }
  }

  checkPermission(key: string) {
    const permissions = localStorage.getItem('permissions')
    if (this.permissions.length == 0 && permissions !== null) {
      this.permissions = JSON.parse(permissions);
    }

    if (this.permissions.includes(key)) {
      return true;
    } else {
      return false;
    }
  }

  getDefaultLocation(role: string): string {
    const location :any = {
      superadmin: '/dashboard',
      supervisor: '/adjudicator/digital-id/ktp',
      operator: '/adjudicator/digital-id/ktp',
      jasmed: '/kesehatan/telemedicine/dokter',
      rekonsile: '/dashboard'
    }

    return location[role];
  }
}
