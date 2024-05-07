import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { DigitalIdService } from '../../services/digital-id/digital-id.service';

@Component({
  selector: 'app-kartu-kesehatan',
  templateUrl: './kartu-kesehatan.component.html',
  styleUrls: ['./kartu-kesehatan.component.scss']
})

export class KartuKesehatanComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: any;

  filter: any;
  listDokumen: any;
  limit: any;
  role: any;
  totalRecord: any;

  constructor(
    private digitalIdService: DigitalIdService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.limit = 10;
    this.reset();
    this.role = this.authService.getUserRole();
    this.getDocuments();
  }

  reset(): void {
    this.filter = {
      param: 'DocNo',
      value: ''
    };
    this.listDokumen = [];
  }

  getDateFormat(date: string): string {
    const d = new Date(date);
    return `${d.getDate()} / ${d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)} / ${d.getFullYear()}`;
  }

  getDocuments() {
    this.dtOptions = {
      searching : false,
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
          DocCardType: 7
        };
        params[this.filter.param] = this.filter.value;

        this.digitalIdService.getDocument(this.role, params).subscribe((res: any) => {
          this.listDokumen = res.data;
          const paginator = res.paginator;
          this.totalRecord = paginator.total_record;
          callback({
            recordsTotal: paginator.total_record,
            recordsFiltered: paginator.total_record,
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
    if (val === 10 || val === 25 || val === 50 || val === 100) {
      this.limit = val;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.page.len(val).draw();
      });
    }
  }

  filterKTP(args : any) {
    this.filter.value = args.target.value;
    this.reloadDataTable();
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }

}
