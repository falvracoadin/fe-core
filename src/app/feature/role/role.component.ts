import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
// //import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { RoleService } from './services/role.service';
import { UserService } from '../user/services/user.service';
import { LandaService } from 'src/app/core/services/landa.service';
import * as fs from 'file-saver';
// import { Workbook } from 'exceljs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as moment from 'moment/moment';

import { Router } from '@angular/router';
import { DecryptionService } from '../../core/services/decryption.service';
import { Subject } from 'rxjs';

interface DataUser {
  Id : any,
  UserId :any,
  RoleId :any
};

interface DataRole {
  RoleName : any,
  RoleType :any,
  Description :any
};

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions !: any;

  listUserRole: any;
  titleModal!: string;
  userId!: number;
  limit: any;
  title: any;
  listUser: any;
  listRole: any;
  listRoleType: any;
  isCreateUserRole!: boolean;
  profile: any;
  dataUser : DataUser = {
    Id : "",
    UserId : "",
    RoleId : ""
  };
  dataRole : DataRole = {
    RoleName : "",
    RoleType : "",
    Description : ""
  };
  totalRecord = 0;

  listRoleKey = [
    'No',
    'Nama Klien',
    'ID',
    'Nama Role',
    'Tipe Role',
  ];

  activeModal: any;

  exportPDF :any = {
    title: '',
    records: [],
    header: [],
  };

  filter: any;

  constructor(
    public authService: AuthService,
    private roleService: RoleService,
    // //private modalService: NgbModal,
    private userService: UserService,
    private landaService: LandaService,
    private router: Router,
    private decryptionService: DecryptionService
  ) { }

  getDefault() {
    this.limit = 10;
    this.listUser = [];
    this.listRole = [];
    this.reset();
  }

  reset() {
    this.dataUser = {
      Id: 0,
      UserId: 0,
      RoleId: 0
    };
    this.dataRole = {
      RoleName: '',
      RoleType: 'App',
      Description: ""
    };
    this.listRoleType = [
      { type: 'app' }, { type: 'web' }
    ];
  }

  ngOnInit(): void {
    this.getProfile();
    this.getDefault();
    this.getUserRole();
    this.fetchExport();
  }

  getProfile() {
    this.authService.getProfile().subscribe((res: any) => this.profile = res);
  }

  getUserRole() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pageLength: this.limit,
      language: {
        paginate: {
          previous: '<i class="fa fa-chevron-left"></i>',
          next: '<i class="fa fa-chevron-right"></i>',
        },
        aria: {
          paginate: {
            previous: 'Previous',
            next: 'Next',
          },
        },
        info: '',
      },
      ajax: (dtParams: any, callback : any) => {
        const params : any = {
          limit: this.limit,
          page: (dtParams.start / dtParams.length) + 1,
        };

        this.roleService.getUserRoles(params, this.decryptionService.GrabEnvironmentKey('mode')).subscribe((res: any) => {
          const records = res.Data;
          this.listUserRole = records;
          dtParams.length = res.data.total_page;
          this.totalRecord = res.data.total_record;
          callback({
            recordsTotal: res.data.total_record,
            recordsFiltered: res.data.total_record,
            data: [],
          });

        }, (err: any) => {

        });
      },
    };
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  openModal(modal : any, title : any, data : any = null, size = 'md') {
    this.title = title;
    this.activeModal = modal;

    switch (title) {
      case 'Add User Role': {
        this.getUser();
        this.getRoles();
        this.reset();
        this.isCreateUserRole = true;
        break;
      }
      case 'Add Role': {
        this.reset();
        this.isCreateUserRole = true;
        this.dataRole.RoleType = 'app';
        break;
      }
      case 'Edit Role': {
        this.dataRole = {
          Description: data.Description,
          RoleName: data.Role,
          RoleType: data.RoleType
        }
        this.isCreateUserRole = false;
        this.userId = data.Id;
        break;
      }
    }
    // this.modalService.open(modal, {
    //   backdrop: 'static',
    //   centered: true,
    //   size: 'md',
    // });
  }

  getUserRoleByUserId(userId: any) {
    this.roleService.getUserRoleByUserId(userId).subscribe((res: any) => {
      if (res.code == 200) {
        this.dataUser = res.data
      } else {
        // this.modalService.dismissAll()
        this.landaService.alertError("Error", res.message)
      }
    })
  }

  createRole() {
    const payload: any = this.dataRole 
    payload.ClientId = 4
    if (this.isCreateUserRole) {
      // this.roleService.createRole(payload, this.decryptionService.GrabEnvironmentKey('mode')).subscribe((res: any) => {
      //   if (res.StatusCode == 200) {
      //     // this.modalService.dismissAll()
      //     this.landaService.alertSuccess("Success", res.Message)
      //     this.reloadDataTable()
      //   } else this.landaService.alertError('Error', res.Message)
      // }, (err: any) => this.landaService.alertError("Error", err.error.message))
    } else {
      this.roleService.updateRole(this.userId, payload, this.decryptionService.GrabEnvironmentKey('mode')).subscribe((res: any) => {
        if (res.StatusCode == 200) {
          // this.modalService.dismissAll()
          this.landaService.alertSuccess("Success", res.Message)
          this.reloadDataTable()
        } else this.landaService.alertError("Error", res.Message)
      }, (err: any) => this.landaService.alertError("Error", err.error.message))
    }
  }

  saveUserRole() {
    const payload = {
      UserId: this.dataUser.UserId,
      RoleId: this.dataUser.RoleId
    }
    if (this.isCreateUserRole) {
      this.roleService.createUserRole(payload).subscribe((res: any) => {
        if (res.code == 200) {
          // this.modalService.dismissAll()
          this.landaService.alertSuccess("Success", res.message)
          this.reloadDataTable()
        } else this.landaService.alertError('Error', res.message)
      }, (err: any) => this.landaService.alertError("Error", err.message))
    }
    else {
      this.roleService.updateUserRole(this.dataUser.Id, payload).subscribe((res: any) => {
        if (res.code == 200) {
          // this.modalService.dismissAll()
          this.landaService.alertSuccess("Success", res.message)
          this.reloadDataTable()
        } else this.landaService.alertError('Error', res.message)
      }, (err: any) => this.landaService.alertError("Error", err.message))
    }
  }

  getUser() {
    this.userService.getUsers({}).subscribe((res: any) => {
      if (res.status == "success") {
        this.listUser = res.data.records;
      }
    })
  }

  getRoles() {
    this.userService.getRoles({}).subscribe((res: any) => {
      if (res.status == "success") {
        this.listRole = res.data.records;
      }
    })
  }

  gotoPermission(user: any) {
    localStorage.setItem('perm' + user.Id, JSON.stringify(user));
    this.router.navigate(['/role', user.Id]).then();
  }

  fetchExport() {
    const params : any = {
      limit: 1000000,
      page: 0,
    };

    this.roleService.getUserRoles(params).subscribe((res: any) => {
      this.exportPDF.title = 'Role List - ' + moment().format('DD MMMM YYYY') + ' - ' + moment().format('HH:mm:ss');
      this.exportPDF.records = res.data.records;

      for (let i = 0; i < this.exportPDF.records.length; i++) {
        this.exportPDF.records[i].No = i + 1;

        if (this.exportPDF.records[i].RoleType === 'web') {
          this.exportPDF.records[i].RoleType = 'Website';
        } else if (this.exportPDF.records[i].RoleType === 'app') {
          this.exportPDF.records[i].RoleType = 'Aplikasi';
        } else {
          this.exportPDF.records[i].RoleType = 'Office';
        }
      }

      this.exportPDF.header = [
        { column: 'No', key: 'No', width: 3 },
        { column: 'Nama Klien', key: 'ClientName', width: 25 },
        { column: 'ID', key: 'Id', width: 10 },
        { column: 'Nama Role', key: 'RoleName', width: 20 },
        { column: 'Tipe Role', key: 'RoleType', width: 15 },
      ];
    }, (err: any) => {
      console.log(err);
    });
  }

  downloadCSV() {
    const replacer = (key :any, value :any) => (value === null ? '' : value);

    const csv = this.exportPDF.records.map((row :any) =>
      this.exportPDF.header.map((fieldName :any) => JSON.stringify(row[fieldName.key], replacer)).join(',')
    );

    let column: any;

    this.exportPDF.header.forEach((val :any) => {
      column += val.column + ',';
    });

    csv.unshift(column);

    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'Role List.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  // downloadExcel() {
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Page 1');

  //   worksheet.columns = this.exportPDF.header.map((val) => {
  //     return { header: val.column, key: val.key, width: val.width };
  //   });

  //   this.exportPDF.records.forEach(e => {
  //     worksheet.addRow(e);
  //   });

  //   workbook.xlsx.writeBuffer().then((data) => {
  //     const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     fs.saveAs(blob, 'Role List.xlsx');
  //   });
  // }

  downloadPDF() {
    const data :any = document.getElementById('exportPDF');
    data.style.display = 'block';
    html2canvas(data).then(canvas => {
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('Role List.pdf');
    });
    data.style.display = 'none';
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }
}
