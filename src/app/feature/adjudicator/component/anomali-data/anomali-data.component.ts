/* tslint:disable:triple-equals */
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { AnomaliDataService } from '../../services/anomali-data/anomali-data.service';

@Component({
  selector: 'app-pembaruan-aplikasi',
  templateUrl: './anomali-data.component.html',
  styleUrls: ['./anomali-data.component.scss']
})
export class AnomaliDataComponent implements OnInit {

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

  constructor(
    private anomaliDataService: AnomaliDataService
  ) { }

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
      ajax: (dtParams: any, callback :any) => {
        const params : any = {
          pageSize: this.limit,
          page: (dtParams.start / dtParams.length) + 1,
          search: this.filter.search
        };
        params[this.filter.param] = this.filter.value;
        this.anomaliDataService.getDataAnomali(params).subscribe((res: any) => {
          this.listDokumen = res.data;
          this.totalRecord = res.paginator.total_record;

          callback({
            recordsTotal: res.paginator.total_record,
            recordsFiltered: res.paginator.total_record,
            data: []
          });
        });
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
