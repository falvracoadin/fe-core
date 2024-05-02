import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LandaService } from 'src/app/core/services/landa.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  id: any;
  role : any;
  tempPermission: any;
  permission: any;
  originPermission!: [any];
  idOriginalPermission!: [any];
  keys: any;
  leftKeys: any;
  centerKeys: any;
  rightKeys: any;
  savePermission!: {
    add: any,
    delete: any
  };

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private landaService: LandaService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.reset();
      this.initTempPermission();
      this.getRole();
      this.getPermission();
    }
  }

  reset() {
    this.role = {};
    this.permission = {};
    this.keys = [];
    this.leftKeys = [];
    this.centerKeys = [];
    this.rightKeys = [];
    this.originPermission = [null];
    this.idOriginalPermission = [null];
    this.savePermission = {
      add: [],
      delete: []
    };
  }

  getRole() {
    const permString = localStorage.getItem('perm' + this.id);
      if (permString !== null) {
        this.role = JSON.parse(permString);
      } else {
        // Handle the case when the item is not found in local storage
      }
  }

  getPermission() {
    this.roleService.getPermissionByRoleId(this.id).subscribe((res: any) => {
      this.initPermission(res.data);
    });
  }

  initPermission(permissionRaw: any) {
    permissionRaw.forEach( (raw : any) => {
      if (raw) {
        this.originPermission.push(raw.PermissionKey);
        this.idOriginalPermission.push(raw.Id);
        const key = raw.PermissionKey.split(':');
        if (!this.permission[key[1]]) {
          this.permission[key[1]] = {};
          this.keys.push(key[1]);
        }
        this.permission[key[1]][key[2]] = true;
      }
    });
  }

  initTempPermission() {
    const permissionRaw = [
      { Id: 79612, PermissionKey: 'Web:Profile:Edit', RoleId: 1125 },
      { Id: 79613, PermissionKey: 'Web:Profile:Delete', RoleId: 1125 },
      { Id: 79614, PermissionKey: 'Web:Password:Edit', RoleId: 1125 },
      { Id: 79615, PermissionKey: 'Web:Media:Edit', RoleId: 1125 },
      { Id: 79616, PermissionKey: 'Web:Clients:Get', RoleId: 1125 },
      { Id: 79617, PermissionKey: 'Web:Client:Create', RoleId: 1125 },
      { Id: 79618, PermissionKey: 'Web:Client:Get', RoleId: 1125 },
      { Id: 79619, PermissionKey: 'Web:Client:Edit', RoleId: 1125 },
      { Id: 79620, PermissionKey: 'Web:Client:Delete', RoleId: 1125 },
      { Id: 79621, PermissionKey: 'Web:RolePermission:Create', RoleId: 1125 },
      { Id: 79622, PermissionKey: 'Web:RolePermissions:Get', RoleId: 1125 },
      { Id: 79623, PermissionKey: 'Web:RolePermission:Edit', RoleId: 1125 },
      { Id: 79624, PermissionKey: 'Web:RolePermission:Delete', RoleId: 1125 },
      { Id: 79625, PermissionKey: 'Web:Roles:Get', RoleId: 1125 },
      { Id: 79626, PermissionKey: 'Web:Role:Create', RoleId: 1125 },
      { Id: 79627, PermissionKey: 'Web:Role:Get', RoleId: 1125 },
      { Id: 79628, PermissionKey: 'Web:Role:Edit', RoleId: 1125 },
      { Id: 79629, PermissionKey: 'Web:Role:Delete', RoleId: 1125 },
      { Id: 79630, PermissionKey: 'Web:UserPermission:Create', RoleId: 1125 },
      { Id: 79631, PermissionKey: 'Web:UserPermissions:Get', RoleId: 1125 },
      { Id: 79632, PermissionKey: 'Web:UserPermission:Edit', RoleId: 1125 },
      { Id: 79633, PermissionKey: 'Web:UserPermission:Delete', RoleId: 1125 },
      { Id: 79634, PermissionKey: 'Web:UserRole:Create', RoleId: 1125 },
      { Id: 79635, PermissionKey: 'Web:UserRoles:Get', RoleId: 1125 },
      { Id: 79636, PermissionKey: 'Web:UserRole:Edit', RoleId: 1125 },
      { Id: 79637, PermissionKey: 'Web:UserRole:Delete', RoleId: 1125 },
      { Id: 79638, PermissionKey: 'Web:Users:Get', RoleId: 1125 },
      { Id: 79639, PermissionKey: 'Web:User:Create', RoleId: 1125 },
      { Id: 79640, PermissionKey: 'Web:User:Get', RoleId: 1125 },
      { Id: 79641, PermissionKey: 'Web:User:Edit', RoleId: 1125 },
      { Id: 79642, PermissionKey: 'Web:User:Delete', RoleId: 1125 },
      { Id: 79643, PermissionKey: 'Web:User:Upgrade:Approve', RoleId: 1125 },
      { Id: 79644, PermissionKey: 'Web:User:Upgrade:Reject', RoleId: 1125 },
      { Id: 79645, PermissionKey: 'Web:Documents:Get', RoleId: 1125 },
      { Id: 79646, PermissionKey: 'Web:Document:Get', RoleId: 1125 },
      { Id: 80458, PermissionKey: 'Web:Report:All', RoleId: 1125 },
      { Id: 80600, PermissionKey: 'Web:Profile:Get', RoleId: 1125 },
      { Id: 80610, PermissionKey: 'Web:AdjAdmin:All', RoleId: 1125 },
      { Id: 80617, PermissionKey: 'Web:Admin:Webdashboard', RoleId: 1125 },
      { Id: 80771, PermissionKey: 'Web:KategoriLokasi:All', RoleId: 1125 },
      { Id: 80772, PermissionKey: 'Web:Lokasi:All', RoleId: 1125 },
      { Id: 80773, PermissionKey: 'Web:Kependudukan:All', RoleId: 1125 },
      { Id: 80867, PermissionKey: 'Web:Cms:All', RoleId: 1125 },
      { Id: 80870, PermissionKey: 'Web:Voucher:All', RoleId: 1125 },
      { Id: 80871, PermissionKey: 'Web:ProgramBantuan:All', RoleId: 1125 },
      { Id: 80872, PermissionKey: 'Web:PenerimaBantuan:All', RoleId: 1125 }
    ];

    this.permission = {};
    permissionRaw.forEach( (raw : any) => {
      if (raw) {
        const key = raw.PermissionKey.split(':');
        if (!this.permission[key[1]]) {
          this.permission[key[1]] = {};
          this.keys.push(key[1]);
        }
        this.permission[key[1]][key[2]] = false;
      }
    });

    const left = Math.ceil(this.keys.length / 3);

    const middle = left * 2;

    for (let i = 0; i < this.keys.length; i++) {
      if (i < left) {
        this.leftKeys.push(this.keys[i]);
      } else if (i >= left && i < middle) {
        this.centerKeys.push(this.keys[i]);
      } else {
        this.rightKeys.push(this.keys[i]);
      }
    }
  }

  checkAll(key : any) {
    const checkElment: any = document.getElementById(key);
    const isChecked = checkElment.checked;
    Object.keys(this.permission[key]).forEach(el => {
      // tslint:disable-next-line:triple-equals
      if (isChecked != this.permission[key][el]) {
        this.permission[key][el] = isChecked;
        this.checkPermission(key, el);
      }
    });
  }

  isCheckAll(key : any) {
    let result = true;
    Object.keys(this.permission[key]).forEach(el => {
      result = result && this.permission[key][el];
    });
    return result;
  }

  getPermissionKey(key : any): any {
    return Object.keys(this.permission[key]);
  }

  getCheckTotalKey(key : any): any {
    const items = this.permission[key];
    return Object.values(items).filter(a => a === true).length;
  }

  checkPermission(key: any, keyPermission: any) {
    const keyRole = `${this.transformText(this.role.RoleType)}:${key}:${keyPermission}`;
    console.log(this.permission[key]);
    if (this.permission[key]) {
      const indexKey = this.originPermission.indexOf(keyRole);
      // tslint:disable-next-line:triple-equals
      if (this.permission[key][keyPermission] && indexKey == -1) {
        this.savePermission.add.push(keyRole);
      } else if (!this.permission[key][keyPermission] && indexKey >= 0) {
        this.savePermission.delete.push(this.idOriginalPermission[indexKey]);
      } else {
        if (indexKey >= 0) {
          // remove delete
          const idData = this.idOriginalPermission[indexKey];
          const indexDelete = this.savePermission.delete.indexOf(idData);
          this.savePermission.delete.splice(indexDelete, 1);
        } else {
          // remove add
          const indexAdd = this.savePermission.add.indexOf(keyRole);
          this.savePermission.add.splice(indexAdd, 1);
        }
      }
    }
  }

  save() {
    console.log(this.savePermission);
    this.savePermission.add.forEach((element:any) => {
      this.roleService.createPermission(this.id, element).subscribe((res: any) => console.log(res));
    });
    this.savePermission.delete.forEach((element:any) => {
      this.roleService.deletePermission(element).subscribe((res: any) => console.log(res));
    });
    this.landaService.alertSuccess('Success', 'Berhasil menyimpan permission');
  }

  transformText(text: string) {
    const char1 = text.substring(0, 1).toUpperCase();
    return char1 + text.substring(1, text.length);
  }
}
