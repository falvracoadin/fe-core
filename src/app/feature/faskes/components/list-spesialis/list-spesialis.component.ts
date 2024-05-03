import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { SpesialisService } from '../../services/spesialis/spesialis.service';

import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list-spesialis',
  templateUrl: './list-spesialis.component.html',
  styleUrls: ['./list-spesialis.component.scss']
})

export class ListSpesialisComponent implements OnInit {
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
  listSpesialis: any;
  limit: any;
  role: any;
  inputLimit: any;
  totalRecord: any;
  titleModal!: string;
  dataForm: any = {};

  constructor(
    private spesialisService: SpesialisService,
    private authService: AuthService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {}

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
    this.getSpesialisList();
  }

  reset(): void {
    this.filter = {
      param: 'noDokumen',
      value: '',
    };
    this.listSpesialis = [];
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
  

  getSpesialisList() {
    //remove if testing was done
    const dummyData = {
      status_code: 200,
      message: 'Success',
      data: {
        list: [
          {
            text : 'Dummy Text 1',
            nameSpecialist: 'Poli Jantung',
            desc : 'Menangani masalah di organ jantung',
            icon : '/assets/icons/spesialis/heart.svg',
            created_by: 'Test User 1',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 1',
            id: 1,
            status: 1,
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
          },
          {
            text : 'Dummy Text 2',
            nameSpecialist: 'Poli Gigi & Mulut',
            desc : 'Menangani masalah di gigi dan mulut',
            icon : '/assets/icons/spesialis/tooth.svg',
            created_by: 'Test User 2',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 2',
            id: 2,
            status: 0,
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
          },
          {
            text : 'Dummy Text 3',
            nameSpecialist: 'Poli Umum',
            desc : 'Menangani masalah umum seperti flu, demam, dll',
            icon : '/assets/icons/spesialis/doctor.svg',
            created_by: 'Test User 3',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 3',
            id: 3,
            status: 0,
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
          },
          {
            text : 'Dummy Text 4',
            nameSpecialist: 'Poli Kulit',
            desc : 'Menangani masalah di kulit dan rambut',
            icon : '/assets/icons/spesialis/skin.svg',
            created_by: 'Test User 4',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 4',
            id: 4,
            status: 0,
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
          },
          {
            text : 'Dummy Text 5',
            nameSpecialist: 'Poli Gizi',
            desc : 'Menangani masalah gizi dan pola makan',
            // icon : 'https://picsum.photos/300/200',
            created_by: 'Test User 5',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 5',
            id: 5,
            status: 0,
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
          },
          {
            text : 'Dummy Text 6',
            nameSpecialist: 'Poli Mata',
            desc : 'Menangani masalah di mata',
            // icon : 'https://picsum.photos/300/200',
            created_by: 'Test User 6',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 6',
            id: 6,
            status: 0,
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
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
        //     this.listSpesialis = res.data.list;
        //     this.totalRecord = res.data.total_items;
        //     callback({
        //       recordsTotal: this.totalRecord,
        //       recordsFiltered: this.totalRecord,
        //       data: [],
        //     });
        //   });
        this.listSpesialis = dummyData.data.list;
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
    this.titleModal = 'Tambah Spesialis';
    this.dataForm = {
      'id': '',
      'nameSpecialist': '',
      'desc': '',
      'icon': '',
    };
    this.modalService.show(modalId, { class : 'modal-lg' });
  }

  updateDokumen(modalId : any, dokumen : any) {
    this.titleModal = 'Edit Spesialis';
    this.dataForm = dokumen;
    this.modalService.show(modalId, { class : 'modal-lg' });
  }

  close(modalId : any = null){
    this.modalService.hide(modalId ? modalId : undefined)
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
