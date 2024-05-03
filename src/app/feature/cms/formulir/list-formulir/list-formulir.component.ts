import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { UserService } from 'src/app/feature/user/services/user.service';
import Swal from 'sweetalert2';
import { FormulirService } from '../services/formulir.service';
import { FormulirModel } from '../formulir.model';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list-formulir',
  templateUrl: './list-formulir.component.html',
  styleUrls: ['./list-formulir.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListFormulirComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: any;

  filterForm: any;

  activeSection: any;
  nowShowsNUmber = 10;
  listUser: any;
  titleModal!: string;
  userId!: number;
  listParam: any;
  filter: any = {
    form_title: '',
    is_multi: '',
    is_draft: '',
  };

  total_record: any;
  limit: any;
  filterParam: any;
  filter2: any;

  // Mobile
  formulirStructure!: FormulirModel;
  sectionIndex = 0;
  list!: any[];
  detail!: any[];
  tempLabel: string | null = null;
  tempDesc: string | null = null;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private formulirService: FormulirService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  setDefault() {
    this.filter = {
      form_title: '',
      is_multi: '',
      is_draft: '',
    };

    this.filterForm = {
      type: null,
      is_draft: null,
    };
  }

  ngOnInit(): void {
    this.filterParam = [
      { param: 'noDokumen', title: 'No. Dokumen' },
      { param: 'nama', title: 'Nama' },
      { param: 'tipeDokumen', title: 'Tipe Dok.' },
      { param: 'tglDiterima', title: 'Tgl. Diterima' },
    ];
    this.listParam = [
      {
        id: 1,
        name: 'Nama Dokumen',
      },
      // {
      //   'id': 2,
      //   'name': 'Email',
      // }
    ];
    this.limit = 10;
    this.filter2 = {
      param: 'noDokumen',
      value: '',
    };
    this.setDefault();
    this.getList();
  }

  getList() {
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
        const page = parseInt(dtParams.start) / parseInt(dtParams.length) + 1;
        const params : any = {
          page,
          filter: JSON.stringify(this.filter),
          limit: dtParams.length,
          offset: dtParams.start,
        };

        this.formulirService.getList(params).subscribe(
          (res: any) => {
            this.listUser = res.data.list;
            this.total_record = res.data.total_items;
            callback({
              recordsTotal: res.data.total_items,
              recordsFiltered: res.data.total_items,
              data: [],
            });
          },
          (err: any) => {
            console.log(err);
          }
        );
      },
    };
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  createUser(modalId:any) {
    this.titleModal = 'Tambah User';
    this.userId = 0;
    this.modalService.show(modalId, { class: 'modal-lg' });
  }

  open(modalId:any) {
    this.titleModal = 'Tambah Formulir';
    this.modalService.show(modalId, {
      class: 'modal-lg'
    });
  }

  updateUser(modalId :any, user :any) {
    this.titleModal = 'Edit User: ' + user.name;
    this.userId = user.id;
    this.modalService.show(modalId, { class: 'modal-lg' });
  }

  close(modalId : any = null){
    this.modalService.hide(modalId ? modalId : undefined)
  }

  deleteUser(userId : any) {
    Swal.fire({
      title: 'Apakah kamu yakin ?',
      text: 'User ini tidak dapat login setelah kamu menghapus datanya',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Ya, Hapus data ini !',
    }).then((result) => {
      if (!result.value) { return false; }

      this.userService.deleteUser(userId).subscribe((res: any) => {
        this.reloadDataTable();
        return
      });
      return
    });
  }

  showsNumberList(number : any) {
    this.nowShowsNUmber = number;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(number).draw();
    });
  }

  openDetail(Id : any) {
    this.router.navigate(['/user', Id]);
  }

  openFilter(modal :any) {
    this.titleModal = 'Filter Formulir';
    // this.modalService.open(modal, {
    //   backdrop: 'static',
    //   centered: true,
    //   size: 'md',
    // });
  }

  showFilter() {
    this.reloadDataTable();
  }

  cleanAll() {
    this.setDefault();
    this.reloadDataTable();
  }

  previewForm(formId :any, id : any) {
    this.formulirService.getDetail(id).subscribe((res) => {
      this.detail = [];
      // @ts-ignore
      this.formulirStructure = res.data.data_form;
      const sections = this.formulirStructure.sections;
      const tempPage = [];
      for (let index = 0; index < sections.length; index++) {
        this.detail.push({
          title:
            this.formulirStructure.detail_sections[sections[index]].title,
          desc: this.formulirStructure.detail_sections[sections[index]].desc,
        });
        const forms =
          this.formulirStructure.detail_sections[sections[index]].forms;
        const tempSection = [];
        for (let jindex = 0; jindex < forms.length; jindex++) {
          const content =
            this.formulirStructure.forms[
              this.formulirStructure.detail_sections[
                this.formulirStructure.sections[index]
              ].forms[jindex]
            ].content;
          const tempForm = [];
          for (let kindex = 0; kindex < content.length; kindex++) {
            const form = content[kindex];
            if (form.name) {
              tempForm.push(form);
            } else {
              tempForm.push(null);
            }
          }
          tempSection.push(tempForm);
        }
        tempPage.push(tempSection);
      }
      this.list = tempPage;
      this.tempLabel = this.detail[this.sectionIndex].title;
      this.tempDesc = this.detail[this.sectionIndex].desc;
      // this.modalService.open(formId, {
      //   centered: true,
      //   windowClass: 'modal-preview',
      // });
    });
  }

  prevSection() {
    if (this.sectionIndex > 0) {
      this.sectionIndex = this.sectionIndex - 1;
    }
  }
  nextSection() {
    if (this.sectionIndex < this.list.length - 1) {
      this.sectionIndex = this.sectionIndex + 1;
    }
  }

  next() {
    this.activeSection =
      this.formulirStructure.sections[
        this.formulirStructure.sections.indexOf(this.activeSection) + 1
      ];
  }
  prev() {
    this.activeSection =
      this.formulirStructure.sections[
        this.formulirStructure.sections.indexOf(this.activeSection) - 1
      ];
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }
}
