import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DoctorService } from '../../services/doctor/doctor.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-dokter',
  templateUrl: './list-dokter.component.html',
  styleUrls: ['./list-dokter.component.scss']
})

export class ListDokterComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement?: DataTableDirective;
  dtInstance?: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};

  docId: any;
  docType: any;
  docTypeName: any;
  listDocType: any;
  filterParam: any;
  filter: any = {};
  listDokter: any;
  limit: number = 10;
  role: any;
  inputLimit: any;
  totalRecord: any;
  titleModal?: string;
  dataForm: any = {};

  constructor(
    private doctorService: DoctorService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.getDokter();
  }

  getDokter() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pageLength: this.limit,
      searching: false,
      language: {
        paginate: {
          previous: '<i class="fa fa-chevron-left"></i>',
          next: '<i class="fa fa-chevron-right"></i>',
          first: '',
          last: '',
        },
        aria: {
          paginate: {
            previous: 'Previous',
            next: 'Next',
            first: 'First',
            last: 'Last',
          },
          sortAscending: ': activate to sort column ascending',
          sortDescending: ': activate to sort column descending',
        },
        info: '',
      },
      ajax: (dtParams: any, callback: any) => {
        const params = {
          limit: this.limit,
          offset: dtParams.start,
        };

        this.doctorService.listDoctor(params).subscribe({
          next: (res: any) => {
            if (res.data == null || res.data.length == 0) {
              this.listDokter = [];
              this.totalRecord = 0;
              dtParams.length = 0;
            } else {
              this.listDokter = res.data.list;
              this.totalRecord = res.data.total_items;
              dtParams.length = res.data.total_items;
            }

            callback({
              recordsTotal: this.totalRecord,
              recordsFiltered: this.totalRecord,
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Terjadi kesalahan saat mengambil data dokter!',
            })
          },
        });
      },
    };
  }

  reloadDataTable(): void {
    this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  changeLimit(val: number) {
    if (val == 10 || val == 25 || val == 50 || val == 100) {
      this.limit = val;
      this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.page.len(val).draw();
      });
    }
  }

  clickLimit() {
    this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }
}
