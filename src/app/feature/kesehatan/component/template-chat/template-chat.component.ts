import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// //import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { TemplateChatService } from '../../services/template-chat/template-chat.service';

import Swal from 'sweetalert2';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-template-chat',
  templateUrl: './template-chat.component.html',
  styleUrls: ['./template-chat.component.scss']
})

export class TemplateChatComponent implements OnInit {
  @ViewChild(DataTableDirective)

  /* datatable configuration */
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};

  /* modal configuration */
  titleModal!: string;

  /* filter configuration */
  filter: any;
  limit: any = 10;
  totalRecord: any;

  /* list data configuration */
  listTemplate: any;

  /* form add configuration */
  dataForm: any = {
    id: 0,
    text: '',
  };

  constructor(
    private modalService: BsModalService,
    private templateService: TemplateChatService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

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
      ajax: async (dtParams: any, callback) => {
        const filter = {
          limit: this.limit,
          offset: dtParams.start,
        }

        /* get list template */
        await this.templateService.listTemplateChat(filter).then((res: any) => {
          if (res.data == null || res.data.length == 0) {
            this.listTemplate = [];
            this.totalRecord = 0;
            dtParams.length = 0;
          } else {
            this.listTemplate = res.data.list;
            this.totalRecord = res.data.total_items;
            dtParams.length = res.data.total_items;
          }
        }).catch(() => {
          this.listTemplate = []
          this.totalRecord = this.listTemplate.length;
        })

        callback({
          recordsTotal: this.totalRecord,
          recordsFiltered: this.totalRecord,
        });
      },
    };
  }

  createModal(modalId: any) {
    this.titleModal = 'Tambah Template Chat';
    this.dataForm = {}
    this.modalService.show(modalId, { class: 'modal-lg' });

  }

  updateModal(modalId: any, data: any) {
    this.titleModal = 'Edit Template Chat';
    this.dataForm = data;
    this.modalService.show(modalId, { class: 'modal-lg' });
  }

  close(modalId: any = null) {
    console.log('close modal')
    this.modalService.hide(modalId ? modalId : undefined)
  }

  deleteDokumen(userId: any) {
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
      return
    });
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // dtInstance.clear().draw();
      dtInstance.columns(0).search('hallo').draw();
      // dtInstance.search('hallo').draw()
    });
  }

  changeLimit(val: any) {
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
