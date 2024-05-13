import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { DoctorScheduleService } from '../../services/doctor-schedule/doctor-schedule.service';
import { BsModalService } from 'ngx-bootstrap/modal'


@Component({
  selector: 'app-jadwal-dokter',
  templateUrl: './jadwal-dokter.component.html',
  styleUrls: ['./jadwal-dokter.component.scss']
})

export class JadwalDokterComponent implements OnInit {
  /* datatable configuration */
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};

  /* data configuration */
  listJadwal: any = [];

  /* parameters configuration */
  filterParam: any;
  filter: any;
  limit: any;
  inputLimit: any;
  totalRecord: any;

  /* modal configuration */
  titleModal!: string;
  dataForm: any = {};

  constructor(
    private doctorScheduleService: DoctorScheduleService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.limit = 10;
    this.getData();
  }

  /* get data function */
  getData() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      pageLength: this.limit,
      pagingType: 'full_numbers',
      language: {
        paginate: {
          previous: '<i class="fa fa-chevron-left"></i>',
          next: '<i class="fa fa-chevron-right"></i>',
          first: '',
          last: '',
        },
        infoPostFix: '',
        info: '',
        infoEmpty: '',
        infoFiltered: ''
      },
      ajax: (dtParams: any, callback) => {
        const filter = {
          limit: this.limit,
          offset: dtParams.start,
        }

        /* get list template */
        this.doctorScheduleService.getDoctorSchedule(filter).then((res: any) => {
          if (res.data == null || res.data.length == 0) {
            this.listJadwal = [];
            this.totalRecord = 0;
            dtParams.length = 0;
          } else {
            this.listJadwal = res.data.list;
            this.totalRecord = res.data.total_items;
            dtParams.length = res.data.total_items;
          }
        }).catch(() => {
          this.listJadwal = []
          this.totalRecord = this.listJadwal.length;
        })

        callback({
          recordsTotal: this.totalRecord,
          recordsFiltered: this.totalRecord,
        });
      },
    };
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  changeLimit(val: number) {
    if (val == 10 || val == 25 || val == 50 || val == 100) {
      this.limit = val;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.page.len(val).draw();
      });
    }
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }

  /* modal functions */
  create(modalId: any) {
    this.titleModal = 'Tambah Jadwal Dokter';
    this.modalService.show(modalId, { class: 'modal-lg' });
  }

  update(modalId: any, data: any) {
    this.titleModal = 'Edit Jadwal Dokter';
    this.dataForm = { uuid: data.uuid, origin_data: data.origin_data };
    this.modalService.show(modalId, { class: 'modal-lg' });
  }

  /* utils */
  // Method to display schedule array as a string
  displaySchedule(schedule: string[]): string {
    if (!schedule || schedule.length === 0) return '-';

    return schedule.join(', ');
  }
}