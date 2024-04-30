import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { VenturoService } from './venturo.service';
import { AesService } from './aes.service';
import { RsaService } from './rsa.service';
import { DecryptionService } from './decryption.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  // get api url

  listPerms: any = [];

  constructor(
    private venturoService: VenturoService,
    private decryptionService: DecryptionService,
    private aesService: AesService,
    private rsaService: RsaService
  ) {}

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
}
