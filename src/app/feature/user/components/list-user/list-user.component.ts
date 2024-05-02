import { Component, OnInit, ViewChild } from '@angular/core';
// //import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DecryptionService } from 'src/app/core/services/decryption.service';

import { UserService } from '../../services/user.service';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement !: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: any = {};

  nowShowsNUmber = 10;
  listUser: any;
  titleModal!: string;
  userId!: number;
  filter = '';
  saasMode = false;
  listUserKey = [
    'Nama',
    'NIK',
    'No. HP',
    'Email'
  ];
  totalRecord = 0;

  exportPDF : any = {
    title: '',
    records: [],
    header: [],
  };

  constructor(
    public authService: AuthService,
    private userService: UserService,
    // //private modalService: NgbModal,
    private router: Router,
    private decryptionService: DecryptionService

  ) { }

  ngOnInit(): void {
    this.getUser();
    this.fetchExport();
    if (this.decryptionService.GrabEnvironmentKey('mode') == 'saas') {
      this.saasMode = true;
    } else {
      this.saasMode = false;
    }
  }

  getUser() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pageLength: this.nowShowsNUmber,
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
          search: this.filter,
          limit: this.nowShowsNUmber,
          page: (dtParams.start / dtParams.length) + 1,
        };

        this.userService.getUsers(params).subscribe((res: any) => {
          const list = res.data.records;
          let pageNumber = dtParams.start + 1;
          list.forEach((val : any) => (val.no = pageNumber++));
          this.listUser = list;
          dtParams.length = res.total_page;
          this.totalRecord = res.data.total_record;
          callback({
            recordsTotal: res.data.total_record,
            recordsFiltered: res.data.total_record,
            data: [],
          });

        }, (err: any) => {

        });
      }
    };
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  createUser(modalId : any) {
    this.titleModal = 'Tambah Pengguna Baru';
    this.userId = 0;
    // //this.modalService.open(modalId, { size: 'lg', centered: true });
  }

  updateUser(modalId : any, user : any) {
    this.titleModal = 'Edit Pengguna: ' + user.name;
    this.userId = user.id;
    // //this.modalService.open(modalId, { size: 'lg', centered: true });
  }

  deleteUser(userId :any) {
    Swal.fire({
      title: 'Apakah kamu yakin ?',
      text: 'User ini tidak dapat login setelah kamu menghapus datanya',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Ya, Hapus data ini !',
    }).then((result) => {
      if (!result.value) { return false; }

      this.userService.deleteUser(userId).subscribe((res: any) => {
        this.reloadDataTable();
      });
      return
    });
  }

  openDetail(Id : any) {
    this.router.navigate(['/user', Id]).then();
  }

  fetchExport() {
    const params : any = {
      limit: 1000000,
      page: 0,
    };

    this.userService.getUsers(params).subscribe((res: any) => {
      this.exportPDF.title = 'User List - ' + moment().format('DD MMMM YYYY') + ' - ' + moment().format('HH:mm:ss');
      this.exportPDF.records = res.data.records;

      for (let i = 0; i < this.exportPDF.records.length; i++) {
        this.exportPDF.records[i].No = i + 1;

        if (this.exportPDF.records[i].Status === 1) {
          this.exportPDF.records[i].Status = 'Aktif';
        } else {
          this.exportPDF.records[i].Status = 'Tidak Aktif';
        }

        if (this.exportPDF.records[i].Source === 'web') {
          this.exportPDF.records[i].Source = 'Website';
        } else if (this.exportPDF.records[i].Source === 'app') {
          this.exportPDF.records[i].Source = 'Aplikasi';
        } else {
          this.exportPDF.records[i].Source = 'Office';
        }
      }

      this.exportPDF.header = [
        { column: 'No', key: 'No', width: 3 },
        { column: 'Nama', key: 'Fullname', width: 23 },
        { column: 'NIK', key: 'NIK', width: 18 },
        { column: 'No. HP', key: 'Phone', width: 17 },
        { column: 'Email', key: 'Email', width: 30 },
        { column: 'Source', key: 'Source', width: 10 },
        { column: 'Status', key: 'Status', width: 15 },
      ];
    }, (err: any) => {
      console.log(err);
    });
  }

  downloadCSV() {
    const replacer = (key :any ,value :any) => (value === null ? '' : value);

    const csv = this.exportPDF.records.map((row :any) =>
      this.exportPDF.header.map((fieldName :any) => JSON.stringify(row[fieldName.key], replacer)).join(',')
    );

    let column : any;

    this.exportPDF.header.forEach((val : any) => {
      column += val.column + ',';
    });

    csv.unshift(column);

    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'User List.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  // downloadExcel() {
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Page 1');

  //   this.exportPDF.header = [
  //     { column: 'No', key: 'No', width: 3 },
  //     { column: 'Nama', key: 'Fullname', width: 23 },
  //     { column: 'NIK', key: 'NIK', width: 18 },
  //     { column: 'No. HP', key: 'Phone', width: 17 },
  //     { column: 'Email', key: 'Email', width: 30 },
  //     { column: 'Source', key: 'Source', width: 10 },
  //     { column: 'Status', key: 'Status', width: 15 },
  //   ];

  //   worksheet.columns = this.exportPDF.header.map((val) => {
  //     return { header: val.column, key: val.key, width: val.width };
  //   });

  //   this.exportPDF.records.forEach(e => {
  //     worksheet.addRow(e);
  //   });

  //   workbook.xlsx.writeBuffer().then((data) => {
  //     const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     fs.saveAs(blob, 'User List.xlsx');
  //   });
  // }

  downloadPDF() {
    const data : any = document.getElementById('exportPDF');
    data.style.display = 'block';
    html2canvas(data).then(canvas => {
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('User List.pdf');
    });
    data.style.display = 'none';
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.nowShowsNUmber).draw();
    });
  }
}
