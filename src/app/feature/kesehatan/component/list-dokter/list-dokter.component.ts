import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// //import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { ListDokterService } from 'src/app/feature/kesehatan/services/list-dokter/list-dokter.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-dokter',
  templateUrl: './list-dokter.component.html',
  styleUrls: ['./list-dokter.component.scss']
})

export class ListDokterComponent implements OnInit {
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
  listDokter: any;
  limit: any;
  role: any;
  inputLimit: any;
  totalRecord: any;
  titleModal!: string;
  dataForm: any = {};

  constructor(
    private listDokterService: ListDokterService,
    private authService: AuthService,
    // private modalService: NgModal,
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
    this.getDokter();
  }

  reset(): void {
    this.filter = {
      param: 'noDokumen',
      value: '',
    };
    this.listDokter = [];
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


  getDokter() {
    //remove if testing was done
    const dummyData = {
      status_code: 200,
      message: 'Success',
      data: {
        list: [
          {
            name: 'Dokter 1',
            email: 'dokter1@mail.com',
            phone: '08123456789',
            created_by: 'Test User 1',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 1',
            id: 1,
            noStr: '12345643242',
            status: 1,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
            spesialis : ['Spesialis 1', 'Spesialis 2']
          },
          {
            name: 'Dokter 2',
            email: 'dokter2@mail.com',
            phone: '08123456789',
            created_by: 'Test User 2',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 2',
            id: 2,
            noStr: '12345634324',
            status: 0,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
            spesialis : ['Spesialis 3', 'Spesialis 4']
          },
          {
            name: 'Dokter 3',
            email: 'dokter3@mail.com',
            phone: '098387218392813',
            created_by: 'Test User 3',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 3',
            id: 3,
            noStr: '12345634324',
            status: 0,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
            spesialis : ['Spesialis 5', 'Spesialis 6']
          },
          {
            name: 'Dokter 4',
            email: 'dokter4@mail.com',
            phone: '098387218392813',
            created_by: 'Test User 4',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 4',
            id: 4,
            noStr: '12345634324',
            status: 0,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
            spesialis : ['Spesialis 7', 'Spesialis 8']
          },
          {
            name: 'Dokter 5',
            email: 'dokter4@mail.com',
            phone : '098387218392813',
            created_by: 'Test User 5',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 5',
            id: 5,
            noStr: '12345634324',
            status: 0,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
            spesialis : ['Spesialis 9', 'Spesialis 10']
          },
          {
            name: 'Dokter 6',
            email: 'dokter4@mail.com',
            phone: '098387218392813',
            created_by: 'Test User 6',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 6',
            id: 6,
            noStr: '12345634324',
            status: 0,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
            spesialis : ['Spesialis 11', 'Spesialis 12']
          },
        ],
        total_items: 6,
      },
    }

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
          limit: this.limit,
          offset: dtParams.start,
          DocCardType: this.docId,
        };
        params[this.filter.param] = this.filter.value;
        // this.dokumenService.getDocument(this.role, params).subscribe((res: any) => {
        //     this.listDokter = res.data.list;
        //     this.totalRecord = res.data.total_items;
        //     callback({
        //       recordsTotal: this.totalRecord,
        //       recordsFiltered: this.totalRecord,
        //       data: [],
        //     });
        //   });
        this.listDokter = dummyData.data.list;
        this.totalRecord = dummyData.data.total_items;
        callback({
          recordsTotal: this.totalRecord,
          recordsFiltered: this.totalRecord,
          data: [],
        });
      },
    };
  }

  createDokumen(modalId:any) {
    this.titleModal = 'Tambah Dokter';
    this.dataForm = {
      'id': '',
      'text': '',
    };
    // //this.modalService.open(modalId, { size: 'lg', centered: true });
  }

  updateDokumen(modalId : any, dokumen : any) {
    this.titleModal = 'Edit Dokter';
    this.dataForm = dokumen;
    // //this.modalService.open(modalId, { size: 'lg', backdrop: 'static' });
  }

  deleteDokumen(userId : any) {
    Swal.fire({
      title: 'Apakah kamu yakin?',
      text: 'Data akan dihapus permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result) => {
      if (!result.value) { return false; }
      // this.dokumenService.deleteDokumen(userId : any).subscribe((res: any) => {
      //   this.reloadDataTable();
      // });
      return
    });
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
        dtInstance.page.len(val).draw();
      });
    }
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }
}
