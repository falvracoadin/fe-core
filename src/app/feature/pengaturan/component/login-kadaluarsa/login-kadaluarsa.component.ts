/* tslint:disable:triple-equals */
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-pembaruan-aplikasi',
  templateUrl: './login-kadaluarsa.component.html',
  styleUrls: ['./login-kadaluarsa.component.scss']
})
export class LoginKadaluarsaComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: any;

  filter: any = {
    search : ''
  };
  listDokumen: any;
  limit: any;
  documentType: any;
  documentStatus: any;
  totalRecord: any;

  constructor() { }

  ngOnInit(): void {
    this.reset();
  }

  reset(): void {
    this.filter = {
      search: ''
    };
    this.initViewComponent();
    this.limit = 10;
    this.listDokumen = [];
    this.getDocuments();
  }

  initViewComponent() {
    this.documentType = {
      26: 'KTP'
    };
    this.documentStatus = {
      10 : 'Anomali'
    };
  }

  getDocuments() {
    this.dtOptions = {
      serverSide: true,
      // processing: true,
      processing: false,
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
      ajax: (dtParams: any, callback :any) => {
        const params : any = {
          pageSize: this.limit,
          page: (dtParams.start / dtParams.length) + 1,
          search: this.filter.search
        };
        params[this.filter.param] = this.filter.value;
      },
    };
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  changeLimit(val : any) {
    if (val == 10 || val == 25 || val == 50 || val == 100) {
      this.limit = val;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.page.len(this.limit).draw();
      });
    }
  }

  getDateFormat(date: string): string {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }
}
