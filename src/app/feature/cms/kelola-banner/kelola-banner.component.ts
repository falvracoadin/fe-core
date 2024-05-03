import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { DokumenService } from '../services/dokumen/dokumen.service';
import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-kelola-banner',
  templateUrl: './kelola-banner.component.html',
  styleUrls: ['./kelola-banner.component.scss']
})

export class KelolaBannerComponent implements OnInit {
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
  listBanner: any;
  limit: any;
  role: any;
  inputLimit: any;
  totalRecord: any;
  titleModal!: string;
  dokumenInput: any;
  listFormulir:any;

  constructor(
    private dokumenService: DokumenService,
    private authService: AuthService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.totalRecord = 0;
    this.filterParam = [
      { param: 'noDokumen', title: 'No. Dokumen' },
      { param: 'nama', title: 'Nama' },
      { param: 'tipeDokumen', title: 'Tipe Dok.' },
      { param: 'tglDiterima', title: 'Tgl. Diterima' },
    ];
    this.limit = 10;
    this.reset();
    this.role = this.authService.getUserRole();
    this.getBanners();
  }

  reset(): void {
    this.filter = {
      param: 'noDokumen',
      value: '',
    };
    this.listBanner = [];
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
  

  getBanners() {
    //remove if testing was done
    const dummyData = {
      status_code: 200,
      message: 'Success',
      data: {
        list: [
          {
            created_by: 'Test User 1',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 1',
            id: 1,
            status: 1,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
          },
          {
            created_by: 'Test User 2',
            created_at: '2022-01-01T00:00:00+00:00',
            doc_title: 'Dummy Document 2',
            id: 2,
            status: 0,
            ikon: 'https://picsum.photos/300/200',
            gambar: 'path/to/placeholder-image.png',
            tanggal_dibuat: '2022-01-01 00:00:00',
            tanggal_status: '2022-01-01 00:00:00',
            updated_at: '2022-01-01T00:00:00+00:00',
          },
        ],
        total_items: 1,
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
        //     this.listBanner = res.data.list;
        //     this.totalRecord = res.data.total_items;
        //     callback({
        //       recordsTotal: this.totalRecord,
        //       recordsFiltered: this.totalRecord,
        //       data: [],
        //     });
        //   });
        this.listBanner = dummyData.data.list;
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
    this.titleModal = 'Tambah Dokumen';
    this.dokumenInput = null;
    this.modalService.show(modalId, { class : 'modal-lg' });
  }

  updateDokumen(modalId : any, dokumen : any) {
    this.titleModal = 'Edit Dokumen: ' + dokumen.doc_title;
    this.dokumenInput = dokumen;
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
      this.dokumenService.deleteDokumen(userId).subscribe((res: any) => {
        this.reloadDataTable();
      });
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