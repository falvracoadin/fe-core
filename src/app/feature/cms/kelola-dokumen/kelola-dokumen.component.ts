/* tslint:disable:triple-equals */
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { DokumenService } from '../services/dokumen/dokumen.service';
import { FormulirService } from '../services/formulir/formulir.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kelola-dokumen',
  templateUrl: './kelola-dokumen.component.html',
  styleUrls: ['./kelola-dokumen.component.scss'],
})
export class KelolaDokumenComponent implements OnInit {
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
  listDokumen: any;
  listFormulir: any;
  limit: any;
  role: any;
  inputLimit: any;
  totalRecord: any;
  titleModal!: string;
  dokumenInput: any;

  constructor(
    private dokumenService: DokumenService,
    private formulirService: FormulirService,
    private authService: AuthService,
    //private modalService: NgbModal,
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
    this.getDocuments();
    this.getFormulir();
  }

  reset(): void {
    this.filter = {
      param: 'noDokumen',
      value: '',
    };
    this.listDokumen = [];
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
    const arrayDate = date.split(' ')[0].split('-');
    return arrayDate[2] + ' / ' + arrayDate[1] + ' / ' + arrayDate[0];
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
          limit: this.limit,
          offset: dtParams.start,
          DocCardType: this.docId,
        };
        params[this.filter.param] = this.filter.value;
        this.dokumenService
          .getDocument(this.role, params)
          .subscribe((res: any) => {
            this.listDokumen = res.data.list;
            this.totalRecord = res.data.total_items;
            callback({
              recordsTotal: this.totalRecord,
              recordsFiltered: this.totalRecord,
              data: [],
            });
          });
      },
    };
  }

  createDokumen(modalId:any) {
    this.titleModal = 'Tambah Dokumen';
    this.dokumenInput = null;
    //this.modalService.open(modalId, { size: 'lg', centered: true });
  }

  updateDokumen(modalId : any, dokumen : any) {
    this.titleModal = 'Edit Dokumen: ' + dokumen.doc_title;
    this.dokumenInput = dokumen;
    //this.modalService.open(modalId, { size: 'lg', backdrop: 'static' });
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

  getFormulir() {
    this.formulirService
      .getFormulir({
        filter: '{"is_draft":0}',
      })
      .subscribe((res: any) => {
        this.listFormulir = res.data.list;
      });
  }
}
