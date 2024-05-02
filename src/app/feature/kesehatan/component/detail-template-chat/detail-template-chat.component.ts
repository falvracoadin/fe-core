import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { TemplateChatService } from '../../services/template-chat/template-chat.service';

@Component({
  selector: 'app-detail-template-chat',
  templateUrl: './detail-template-chat.component.html',
  styleUrls: ['./detail-template-chat.component.scss']
})
export class DetailTemplateChatComponent implements OnInit {
  /* input output data */
  @Input() dataForm: any;
  @Output() afterSave = new EventEmitter<boolean>();

  /* form data configuration */
  formModel!: {
    id: number | null;
    text: string | null;
  };

  constructor(
    private landaService: LandaService,
    private templateChatService: TemplateChatService
  ) { }

  ngOnInit(): void {
    this.formModel = {
      id: this.dataForm.id,
      text: this.dataForm.text,
    };
  }

  /* modal function */
  close() {
    this.afterSave.emit();
  }

  save() {
    /* validate */
    if (!this.formModel.text) {
      this.landaService.alertError('Error', 'Text harus diisi')
      return
    }

    /* if id is exist then update data, if not exist then create data */
    const payload = {
      text: this.formModel.text
    };
    if (this.formModel.id) {
      /* update data */
      this.templateChatService.updateTemplateChat(this.formModel.id, payload).then((res: any) => {
        if (res.status_code === 200) {
          this.afterSave.emit();
          this.landaService.alertSuccess('Success', 'Data berhasil diubah');
        } else {
          this.landaService.alertError('Error', 'Data gagal diubah');
        }
      })
    } else {
      /* create data */
      this.templateChatService.createTemplateChat(payload).then((res: any) => {
        if (res.status_code === 200) {
          this.afterSave.emit();
          this.landaService.alertSuccess('Success', 'Data berhasil ditambah');
        } else {
          this.landaService.alertError('Error', 'Data gagal ditambah');
        }
      })
    }
  }
}
