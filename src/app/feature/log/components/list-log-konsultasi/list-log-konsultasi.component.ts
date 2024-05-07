import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// //import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { LogsService } from 'src/app/feature/log/services/logs.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-log-konsultasi',
  templateUrl: './list-log-konsultasi.component.html',
  styleUrls: ['./list-log-konsultasi.component.scss']
})

export class ListLogKonsultasiComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: any;

  docId: any;
  docType: any;
  docTypeName: any;
  listDocType: any;
  filterParam: any;
  filter: any;
  listLogs: any;
  limit: any;
  role: any;
  inputLimit: any;
  totalRecord: any;
  titleModal!: string;
  dataForm: any = {};

  constructor(
    private logsService: LogsService,
    private authService: AuthService,
    // //private modalService: NgbModal,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.totalRecord = 0;
    this.filterParam = [
      { param: 'noDokumen', title: 'No. Dokumen' },
      { param: 'nama', title: 'Nama' },
      { param: 'tipeDokumen', title: 'Tipe Dok.' },
      { param: 'tglDiterima', title: 'Tgl. Diterima' },
    ];
    this.limit = 10;
    this.reset();
    this.role = this.authService.getUserRole();
    this.getLogs();
  }

  reset(): void {
    this.filter = {
      param: 'noDokumen',
      value: '',
    };
    this.listLogs = [];
    this.listDocType = [
      { type: 'ktp', id: 2, name: 'KTP' },
      { type: 'passport', id: 6, name: 'Passport' },
    ];
    const docType = this.route.snapshot.paramMap.get('docType');
    this.listDocType.forEach((element : any) => {
      if (element.type == docType) {
        this.docId = element.id;
        this.docType = element.type;
        this.docTypeName = element.name;
      }
    });
  }

  getDateFormat(date: string): string {
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return formattedDate;
  }


  getLogs() {
    //remove if testing was done
    const dummyData = {
      status_code: 200,
      message: 'Success',
      data: {
        list: [
          {
            namePatient: 'Pasien 1',
            emailPatient: 'patient1@mail.com',
            nameDoctor: 'Dokter 1',
            emailDoctor: 'dokter1@mail.com',
            noTrx: 'TRX1234567890',
            phone: '08123456789',
            faskes: 'RSUD Dr. Soetomo',
            created_by: 'Test User 1',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 1',
            id: 1,
            noPeserta: '12345643242',
            status: 'Finished',
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            consultation: '2022-01-01 14:30:00',
            consultation_end: '2022-01-01 14:30:00',
            price: 'Rp100.000,00',
            updatedAt: '2022-01-01T00:00:00+00:00',
            spesialis: ['Spesialis 1', 'Spesialis 2']
          },
          {
            namePatient: 'Pasien 2',
            emailPatient: 'patient2@mail.com',
            nameDoctor: 'Dokter 2',
            emailDoctor: 'dokter2@mail.com',
            noTrx: 'TRX1234567890',
            phone: '08123456789',
            faskes: 'Klinik Budiman',
            created_by: 'Test User 2',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 2',
            id: 2,
            noPeserta: '12345634324',
            status: 'Save Chat',
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            consultation: '2022-01-01 14:30:00',
            consultation_end: '2022-01-01 14:30:00',
            price: 'Rp100.000,00',
            updatedAt: '2022-01-01T00:00:00+00:00',
            spesialis: ['Spesialis 3', 'Spesialis 4']
          },
          {
            namePatient: 'Pasien 3',
            emailPatient: 'patient3@mail.com',
            nameDoctor: 'Dokter 3',
            emailDoctor: 'dokter3@mail.com',
            noTrx: 'TRX1234567890',
            phone: '098387218392813',
            faskes: 'RSUD Dr. Soetomo',
            created_by: 'Test User 3',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 3',
            id: 3,
            noPeserta: '12345634324',
            status: 'Idle',
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            consultation: '2022-01-01 14:30:00',
            consultation_end: '2022-01-01 14:30:00',
            price: 'Rp100.000,00',
            updatedAt: '2022-01-01T00:00:00+00:00',
            spesialis: ['Spesialis 5', 'Spesialis 6']
          },
          {
            namePatient: 'Pasien 4',
            emailPatient: 'patient4@mail.com',
            nameDoctor: 'Dokter 4',
            emailDoctor: 'dokter4@mail.com',
            noTrx: 'TRX1234567890',
            phone: '098387218392813',
            faskes: 'Klinik Budiman',
            created_by: 'Test User 4',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 4',
            id: 4,
            noPeserta: '12345634324',
            status: 'On Chat',
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            consultation: '2022-01-01 14:30:00',
            consultation_end: '2022-01-01 14:30:00',
            price: 'Rp100.000,00',
            updatedAt: '2022-01-01T00:00:00+00:00',
            spesialis: ['Spesialis 7', 'Spesialis 8']
          },
          {
            namePatient: 'Pasien 5',
            emailPatient: 'patient5@mail.com',
            nameDoctor: 'Dokter 5',
            emailDoctor: 'dokter5@mail.com',
            noTrx: 'TRX1234567890',
            phone: '098387218392813',
            faskes: 'RSUD Dr. Soetomo',
            created_by: 'Test User 5',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 5',
            id: 5,
            noPeserta: '12345634324',
            status: 'Rejected by Doctor',
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            consultation: '2022-01-01 14:30:00',
            consultation_end: '2022-01-01 14:30:00',
            price: 'Rp100.000,00',
            updatedAt: '2022-01-01T00:00:00+00:00',
            spesialis: ['Spesialis 9', 'Spesialis 10']
          },
          {
            namePatient: 'Pasien 6',
            emailPatient: 'patient6@mail.com',
            nameDoctor: 'Dokter 6',
            emailDoctor: 'dokter6@mail.com',
            noTrx: 'TRX1234567890',
            phone: '098387218392813',
            faskes: 'Klinik Budiman',
            created_by: 'Test User 6',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 6',
            id: 6,
            noPeserta: '12345634324',
            status: 'Rejected by Doctor',
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            consultation: '2022-01-01 17:00:00',
            consultation_end: '2022-01-01 14:30:00',
            price: 'Rp100.000,00',
            updatedAt: '2022-01-01T00:00:00+00:00',
            spesialis: ['Spesialis 11', 'Spesialis 12']
          },
        ],
        total_items: 6,
      },
    }

    this.dtOptions = {
      searching:false,
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
          limit: this.limit,
          offset: dtParams.start,
          DocCardType: this.docId,
        };
        params[this.filter.param] = this.filter.value;
        // this.dokumenService.getDocument(this.role, params).subscribe((res: any) => {
        //     this.listLogs = res.data.list;
        //     this.totalRecord = res.data.total_items;
        //     callback({
        //       recordsTotal: this.totalRecord,
        //       recordsFiltered: this.totalRecord,
        //       data: [],
        //     });
        //   });
        this.listLogs = dummyData.data.list;
        this.totalRecord = dummyData.data.total_items;
        callback({
          recordsTotal: this.totalRecord,
          recordsFiltered: this.totalRecord,
          data: [],
        });
      },
    };
  }

  // createDokumen(modalId:any) {
  //   this.titleModal = 'Tambah Jadwal Dokter';
  //   this.dataForm = {
  //     'id': '',
  //     'text': '',
  //   };
  //   //this.modalService.open(modalId, { size: 'lg', centered: true });
  // }

  // updateDokumen(modalId : any, dokumen : any) {
  //   this.titleModal = 'Edit Jadwal Dokter';
  //   this.dataForm = dokumen;
  //   //this.modalService.open(modalId, { size: 'lg', backdrop: 'static' });
  // }

  // deleteDokumen(userId : any) {
  //   Swal.fire({
  //     title: 'Apakah kamu yakin?',
  //     text: 'Data akan dihapus permanen',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#34c38f',
  //     cancelButtonColor: '#f46a6a',
  //     confirmButtonText: 'Ya',
  //     cancelButtonText: 'Tidak',
  //   }).then((result) => {
  //     if (!result.value) { return false; }
  //     // this.dokumenService.deleteDokumen(userId : any).subscribe((res: any) => {
  //     //   this.reloadDataTable();
  //     // });
  //   });
  // }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  changeLimit(val : any) {
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

  formatDateTime(dateTime: string | Date): string {
    if (!dateTime) return "-"; // Return "-" if dateTime is falsy
  
    // If dateTime is a string, parse it into a Date object
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  
    // Get the individual components of the date
    const day = ('0' + date.getDate()).slice(-2);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);
  
    // Construct the formatted date string
    const formattedDateTime = `${day} ${month} ${year} ${hour}:${minute}:${second}`;
    return formattedDateTime;
  }
  
  
}
