import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';


@Injectable({
  providedIn: 'root'
})
export class RoleService extends LandaService {

  getUserRoles(params: any = {}, mode : any = null) {
    //Overwrite mode for staging saas
    return this.DataGet("/access/v2/roles/list", {
      Limit: params["limit"],
      Page: params["page"]
    }, "saas");
  }

  getUserRoleByUserId(userId: any) {
    // return this.DataGet('/access/user-role/detail/' + userId)

    //test local private
    return this.DataGet("/access/user-role/detail/" + userId);
  }

  getRoleByClientId(clientId: any) {
    return this.DataGet('/access/roles/detail/' + clientId)
  }

  getClientDetail(clientId: any) {
    return this.DataGet('/access/client/detail/' + clientId)
  }

  createUserRole(payload: any) {
    // return this.DataPost("/access/user-role/add", payload);

    //test local private
    return this.DataPost("/access/user-role/add", payload);
  }


  createRole(payload: any = null, mode: any = null) {
    // Test local private
    if (mode == 'default') {
      return this.DataPost("/access/roles/add", payload);
    } else if (mode == 'saas') {
      return this.DataPost("/access/v2/roles/create", {
        Role: payload["RoleName"],
        Type: payload["RoleType"],
        Description: payload["Description"]
      }, false, mode);
    }
    return undefined; // Return undefined if mode is neither 'default' nor 'saas'
  }
  

  updateRole(id: any, payload: any, mode : any = null) {
    console.log(mode)
    if (mode == "saas") {
      return this.DataPut("/access/v2/roles/update/" + id, {
        Role: payload["RoleName"],
        Type: payload["RoleType"],
        Description: payload["Description"]
      }, false, mode)
    }
    return this.DataPut('/access/roles/edit/' + id, payload)
  }

  updateUserRole(UserId: any, payload: any) {
    return this.DataPut("/access/user-role/edit/" + UserId, payload);
  }

  getPermissionByRoleId(id : any) {
    // return this.DataGet("/access/role-permission/detail/" + id);
    return this.DataGet("/access/role-permission/detail/" + id);
  }

  updatePermission(id : any, payload : any) {
    return this.DataPut("/access/role-permission/edit/" + id, payload)
  }

  createPermission(RoleId: any, PermissionKey: any) {
    return this.DataPost('/access/role-permission/add', { RoleId, PermissionKey })
  }

  deletePermission(RolePermissionId: any) {
    return this.DataDelete('/access/role-permission/delete/' + RolePermissionId)
  }
}
