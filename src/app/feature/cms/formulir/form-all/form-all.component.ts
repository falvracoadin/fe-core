/* tslint:disable:triple-equals prefer-for-of */
import { Component, OnInit, ViewEncapsulation, LOCALE_ID, HostListener, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DndDropEvent } from 'ngx-drag-drop';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormulirService } from '../services/formulir.service';
import { component } from '../formulir-data';
import { FormulirModel } from '../formulir.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LandaService } from 'src/app/core/services/landa.service';

@Component({
  selector: 'app-form-all',
  templateUrl: './form-all.component.html',
  styleUrls: ['./form-all.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormAllComponent implements OnInit {
  // @HostListener('document:click', ['$event'])
  // clickout(event : any) {
  //   if(event.target.id == this.indexFormFocus[0]+1) {
  //     console.log(event.target,'active')
  //   } else {
  //     this.indexFormFocus = [-1,-1]
  //   }
  // }
  // Form Data
  formulirStructure!: FormulirModel;
  formType!: string;
  mode = 'move';
  from = 'template';
  indexTempOndrag!: number;
  columnMode = 1;
  sectionIndex = 0;
  placeholderStatus = false;
  propertiStatus = false;
  formChangeType: any;
  paramId: any;
  modePage = 'add';

  // Radio
  radioForm: any;
  stateReloadRadio = true;
  radioDetail : number = 0;
  changeRadioDetail(RadioIndex : number){
    if(RadioIndex == this.radioDetail) {
      console.log(RadioIndex)
      this.radioDetail = 0
    } else {
      this.radioDetail = RadioIndex
    }
  }

  list!: any[];
  detail!: any[];
  tempLabel: string | null = null;
  tempDesc: string | null = null;

  indexFormFocus = [-1, -1];

  // Search template
  templates: any;
  searchAset: any | null;
  templatesFull: any | null;

  // Flow Save
  flowCondition!: number;
  flowSaveData = [
    {
      title: 'Kamu yakin ingin kembali ?',
      desc: 'Formulir yang kamu buat akan disimpan sebagai draf. Kamu bisa membukanya kembali nanti.',
      cancel: 'Batal',
      confirm: 'Simpan Sebagai Draft',
    },
    {
      title: 'Simpan Dokumen?',
      desc: 'Kamu akan menyimpan formulir. Pastikan formulir sudah dibuat dengan benar dan sesuai.',
      cancel: 'Batal',
      confirm: 'Simpan',
    },
    {
      title: 'Dokumen Berhasil Disimpan',
      desc: 'Apakah kamu ingin membuat formulir baru?',
      cancel: 'Tutup',
      confirm: 'Ya, Buat',
    },
  ];
  constructor(
    private modals: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private formulirService: FormulirService,
    private landaService : LandaService,
    private eRef : ElementRef
  ) {}

  ngOnInit(): void {
    // Page
    const type = this.route.snapshot.paramMap.get('type');
    if (type == 'single' || type == 'multi') {
      this.formType = type;
    } else {
      this.router.navigate(['/cms/formulir']).then();
    }
    // Form Data
    if (this.modePage == 'add') {
      this.detail = [
        {
          title: null,
          desc: null,
        },
      ];
    }

    // Form Structure
    this.paramId = this.route.snapshot.paramMap.get('id');
    if (this.paramId != null) {
      this.modePage = 'edit';
      this.getByID(this.paramId);
    } else {
      this.formulirStructure = {
        form_title: "",
        sections: [],
        detail_sections: {},
        forms: {},
        is_draft: 0,
        is_multi: 0,
      };
      this.list = [[]];
    }

    // Search
    this.templates = component;
    this.searchAset = null;
    this.templatesFull = component;
  }

  getByID(id : any) {
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
    });
  }

  // Page
  changePage(id : any) {
    this.detail[this.sectionIndex].title = this.tempLabel;
    this.detail[this.sectionIndex].desc = this.tempDesc;
    this.sectionIndex = id;
    this.tempLabel = this.detail[this.sectionIndex].title;
    this.tempDesc = this.detail[this.sectionIndex].desc;
    this.indexFormFocus = [-1, -1];
    this.closePopover();
  }

  addPage() {
    this.list.splice(this.list.length, 0, []);
    this.detail.splice(this.list.length, 0, {
      title: null,
      desc: null,
    });
  }

  closePage(event: MouseEvent, id : any) {
    if (this.list.length - 1 > 0) {
      this.list.splice(id, 1);
      this.detail.splice(id, 1);
      if (id == this.sectionIndex) {
        const tempSectionIndex = id - 1;
        if (tempSectionIndex >= 0) {
          this.sectionIndex = tempSectionIndex;
        } else {
          this.sectionIndex = 0;
        }
      } else {
        this.sectionIndex = 0;
      }
    }
    this.tempLabel = this.detail[this.sectionIndex].title;
    this.tempDesc = this.detail[this.sectionIndex].desc;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  // Drop
  onDragStart(i:any) {
    if (this.from == 'list') {
      this.indexTempOndrag = i;
    }
    // console.log("drag started", JSON.stringify(event, null, 2), data, i);
  }

  onDragEnd() {
    // console.log("drag ended", JSON.stringify(event, null, 2));
  }

  onDraggableCopied() {
    // console.log("draggable copied", JSON.stringify(event, null, 2));
  }

  onDraggableLinked() {
    // console.log("draggable linked", JSON.stringify(event, null, 2));
  }

  onDraggableMoved() {
    // console.log("draggable moved", JSON.stringify(event, null, 2));
  }

  onDragCanceled() {
    this.placeholderStatus = false;
    // console.log("drag cancelled", JSON.stringify(event, null, 2));
  }

  onDrop(event: DndDropEvent) {
    const dropZone = document.getElementById('dropzone');
    if(!dropZone) return;
    const rect = dropZone.getBoundingClientRect();
    const centerDropZone = rect.left + rect.width / 2;

    // console.log("dropped", JSON.stringify(event, null, 2));
    if (this.from == 'list') {
      if (this.mode == 'move') {
        if (
          this.indexTempOndrag != event.index &&
          event.index != this.indexTempOndrag + 1
        ) {
          if(!event.index) return;
          if (this.indexTempOndrag < event.index) {
            this.list[this.sectionIndex].splice(event.index, 0, event.data);
            this.list[this.sectionIndex].splice(this.indexTempOndrag, 1);
            this.indexFormFocus = [event.index - 1, 0];
          } else if (this.indexTempOndrag > event.index) {
            this.list[this.sectionIndex].splice(this.indexTempOndrag, 1);
            this.list[this.sectionIndex].splice(event.index, 0, event.data);
            this.indexFormFocus = [event.index, 0];
          }
        }
      } else if (this.mode == 'copy') {
        if(!event.index) return;
        this.list[this.sectionIndex].splice(event.index, 0, event.data);
        this.indexFormFocus = [event.index, 0];
        this.mode = 'move';
      }
      // tslint:disable-next-line:no-conditional-assignment
    } else if ((this.from = 'template')) {
      if (this.columnMode == 1) {
        this.list[this.sectionIndex].splice(event.index, 0, [event.data]);
      } else if (this.columnMode == 2) {
        if (event.event.x < centerDropZone) {
          this.list[this.sectionIndex].splice(event.index, 0, [
            event.data,
            null,
          ]);
        } else {
          this.list[this.sectionIndex].splice(event.index, 0, [
            null,
            event.data,
          ]);
        }
      }
      this.indexFormFocus = [-1, -1];
    }
    this.propertiStatus = false;
    this.placeholderStatus = false;
    this.closePopover();
  }

  deleteItem(i : any, j:any) {
    if (this.list[this.sectionIndex][i].length == 1) {
      this.list[this.sectionIndex].splice(i, 1);
    } else if (this.list[this.sectionIndex][i].length == 2) {
      this.list[this.sectionIndex][i][j] = null;
      if (
        this.list[this.sectionIndex][i][0] == null &&
        this.list[this.sectionIndex][i][1] == null
      ) {
        this.list[this.sectionIndex].splice(i, 1);
      }
    }
    this.indexFormFocus = [-1, -1];
    this.closePopover();
  }

  onDrop2(event: DndDropEvent, i:any) {
    const dropZone = document.getElementById('dropzone');
    if(!dropZone) return
    const rect = dropZone.getBoundingClientRect();
    const centerDropZone = rect.left + rect.width / 2;
    if (this.from == 'list') {
      if (this.mode == "move") {
        if (
          this.indexTempOndrag != event.index &&
          event.index != this.indexTempOndrag + 1
        ) {
          if(!event.index) return
          if (this.indexTempOndrag < event.index) {
            this.list.splice(event.index, 0, event.data);
            this.list.splice(this.indexTempOndrag, 1);
          } else if (this.indexTempOndrag > event.index) {
            this.list.splice(this.indexTempOndrag, 1);
            this.list.splice(event.index, 0, event.data);
          }
        }
      } else if (this.mode == "copy") {
        if(!event.index) return
        this.list.splice(event.index, 0, event.data);
      }
      // tslint:disable-next-line:no-conditional-assignment
    } else if ((this.from = 'template')) {
      if (event.event.x < centerDropZone) {
        this.list[this.sectionIndex][i][0] = event.data;
      } else {
        this.list[this.sectionIndex][i][1] = event.data;
      }
    }
  }

  // Dropzone
  formClick(i : any, j :any, event: any) {
    if (
      this.indexFormFocus[0] == i &&
      this.indexFormFocus[1] == j ||
      this.propertiStatus
    ) {
      this.propertiStatus = false;
      this.indexFormFocus = [-1, -1];
      this.changeRadioDetail(0);
    } else if(this.indexFormFocus[0] != -1 && this.indexFormFocus[1] != -1){
      this.indexFormFocus = [i, j];
      this.propertiStatus = true;
      this.changeRadioDetail(0);
    } else {
      this.indexFormFocus = [i, j];
      this.propertiStatus = true;
      this.changeRadioDetail(0);
    }
    
    // else if (
    //   this.indexFormFocus[0] == i &&
    //   this.indexFormFocus[1] == j &&
    //   !this.propertiStatus
    // ) {
    //   this.propertiStatus = true;
    //   this.indexFormFocus = [i, j];
    //   this.formChangeType =
    //     this.list[this.sectionIndex][this.indexFormFocus[0]][
    //       this.indexFormFocus[1]
    //     ].type;
    // } else if (this.indexFormFocus[0] == -1 && this.indexFormFocus[1] == -1) {
    //   this.propertiStatus = true;
    //   this.indexFormFocus = [i, j];
    //   this.formChangeType =
    //     this.list[this.sectionIndex][this.indexFormFocus[0]][
    //       this.indexFormFocus[1]
    //     ].type;
    // } else {
    //   this.closePopover();
    //   this.propertiStatus = false;
    //   this.indexFormFocus = [-1, -1];
    // }
  }

  changeMode(param :any) {
    this.mode = param;
  }

  closePopover() {
    // const els = document.querySelectorAll('.popover');
    // for (let i = 0; i < els.length; i++) {
    //   els[i].setAttribute('hidden', 'true');
    // }
    this.propertiStatus = false;
  }

  // Search
  searchListAset() {
    const temp :any = [];
    this.templatesFull.forEach((element: any) => {
      if (element.name.toLowerCase().includes(this.searchAset.toLowerCase())) {
        temp.push(element);
      }
    });
    this.templates = temp;
  }

  save(modalId:any) {
    this.prepareData();
    this.formulirStructure.is_draft = 0;
    this.flowCondition = 1;
    this.modals.show(modalId);
    if (this.modePage == "add") {
      this.formulirService
        .addFormulir(this.formulirStructure)
        .subscribe((res) => {
          this.landaService.alertSuccess(
            "Berhasil",
            "Berhasil Menambahkan Formulir"
          );
          this.router.navigate(["/cms/formulir"]);
        });
    } else {
      this.formulirService
        .editFormulir(this.formulirStructure, this.paramId)
        .subscribe((res) => {
          this.landaService.alertSuccess(
            "Berhasil",
            "Berhasil Mengubah Formulir"
          );
          this.router.navigate(["/cms/formulir"]);
        });
    }
  }

  // Form
  changeForm() {
    const temp = this.templates.find((x:any) => x.type == this.formChangeType);
    if (temp != undefined) {
      this.list[this.sectionIndex][this.indexFormFocus[0]][
        this.indexFormFocus[1]
      ] = temp;
      this.propertiStatus = false;
    }
  }

  // Radio
  onDraggedRadio(item: any, list: any[]) {
    const index = list.indexOf(item);
    list.splice(index, 1);
  }

  addRadio(val :any) {
    this.list[this.sectionIndex][this.indexFormFocus[0]][
      this.indexFormFocus[1]
    ].option.push({
      id:
        this.list[this.sectionIndex][this.indexFormFocus[0]][
          this.indexFormFocus[1]
        ].option.length + 1,
      label: val,
    });
    this.radioForm = '';
    // this.stateReloadRadio = false;
    // setTimeout(() => {
    //   this.stateReloadRadio = true;
    // }, 1);
  }

  removeRadio(idx :any) {
    const id =
      this.list[this.sectionIndex][this.indexFormFocus[0]][
        this.indexFormFocus[1]
      ].option.indexOf(idx);
    this.list[this.sectionIndex][this.indexFormFocus[0]][
      this.indexFormFocus[1]
    ].option.splice(id, 1);
    this.stateReloadRadio = false;
    setTimeout(() => {
      this.stateReloadRadio = true;
    }, 1);
  }

  onDropRadio(event: DndDropEvent, FilteredList?: any[]) {
    console.log(event);
    if (FilteredList && event.dropEffect === 'move') {
      let index = event.index;
      console.log('event', event);

      if (typeof index === 'undefined') {
        index = FilteredList.length;
      }
      FilteredList.splice(index, 0, event.data);
    }
  }

  checkMultipleSelectInNgSelect(list:any, option:any) {
    // tslint:disable-next-line:only-arrow-functions
    option.forEach(function(item:any) {
      item.selected = !!list.includes(item.id);
    });
  }

  // Flow Save
  back(id:any) {
    this.prepareData();
    this.formulirStructure.is_draft = 1;
    if (this.formulirStructure.forms['form-1']) {
      if (this.formulirStructure.forms['form-1'].content.length != 0) {
        this.flowCondition = 0;
        this.modals.show(id);
      } else {
        this.router.navigate(['/cms/formulir']).then();
      }
    } else if (
      (this.formulirStructure.form_title != null &&
        this.formulirStructure.form_title != '') ||
      (this.formulirStructure.detail_sections['section-1'].desc != null &&
        this.formulirStructure.detail_sections['section-1'].desc != '') ||
      (this.formulirStructure.detail_sections['section-1'].desc != null &&
        this.formulirStructure.detail_sections['section-1'].desc != '')
    ) {
      this.flowCondition = 0;
      this.modals.show(id);
    } else {
      this.router.navigate(['/cms/formulir']).then();
    }
  }

  flowSave(param :any) {
    if (param == 'cancel') {
      if (this.flowCondition == 0 || this.flowCondition == 1) {
        this.modals.hide();
        this.flowCondition = 0;
      } else if (this.flowCondition == 2) {
        this.flowCondition = 0;
        this.modals.hide();
        this.router.navigate(['/cms/formulir']).then();
      }
    } else if (param == 'confirm') {
      if (this.flowCondition == 0) {
        this.flowCondition = 1;
      } else if (this.flowCondition == 1) {
        if (this.modePage == 'add') {
          this.formulirService
            .addFormulir(this.formulirStructure)
            .subscribe(() => {
              this.flowCondition = 2;
            });
        } else {
          this.formulirService
            .editFormulir(this.formulirStructure, this.paramId)
            .subscribe(() => {
              this.flowCondition = 2;
            });
        }
      } else if (this.flowCondition == 2) {
        this.formulirStructure = {
          form_title: '',
          sections: ['section-1'],
          detail_sections: {
            'section-1': {
              id: 'section-1',
              title: '',
              desc: '',
              forms: [],
            },
          },
          forms: {},
          is_draft: 0,
          is_multi: 0,
        };
        this.modals.hide();
        this.flowCondition = 0;
        this.router.navigate(['/cms/formulir']).then();
      }
    }
  }

  prepareData() {
    let indexForm = 1;
    this.formulirStructure.form_title = this.formulirStructure.form_title
      ? this.formulirStructure.form_title
      : '';
    this.formulirStructure.detail_sections = {};
    this.formulirStructure.sections = [];
    this.formulirStructure.forms = {};
    if (this.formType == 'multi') {
      this.formulirStructure.is_multi = 1;
    }
    for (let index = 0; index < this.list.length; index++) {
      const tempForm = [];
      for (let jindex = 0; jindex < this.list[index].length; jindex++) {
        const tempFormStr = 'form-' + indexForm;
        indexForm = indexForm + 1;
        tempForm.push(tempFormStr);
        const tempContent = [];
        for (
          let kindex = 0;
          kindex < this.list[index][jindex].length;
          kindex++
        ) {
          if (this.list[index][jindex][kindex] != null) {
            tempContent.push(this.list[index][jindex][kindex]);
            tempContent[kindex].id = tempFormStr + '-' + (kindex + 1);
          } else {
            tempContent.push({
              id: tempFormStr + '-' + (kindex + 1),
            });
          }
        }
        this.formulirStructure.forms[tempFormStr] = {
          id: tempFormStr,
          content: tempContent,
        };
      }
      const tempSection = 'section-' + (index + 1);
      this.formulirStructure.sections.push(tempSection);
      this.formulirStructure.detail_sections[tempSection] = {
        id: tempSection,
        title: this.detail[index].title ? this.detail[index].title : '',
        desc: this.detail[index].desc ? this.detail[index].desc : '',
        forms: tempForm,
      };
    }
  }

  // Mobile
  previewForm(id:any) {
    this.modals.show(id);
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

  closeModal() {
    this.modals.hide()
  }
}
