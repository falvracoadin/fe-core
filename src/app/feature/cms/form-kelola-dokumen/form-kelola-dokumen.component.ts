/* tslint:disable:triple-equals */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LandaService } from 'src/app/core/services/landa.service';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { DokumenService } from '../services/dokumen/dokumen.service';

@Component({
  selector: 'app-form-kelola-dokumen',
  templateUrl: './form-kelola-dokumen.component.html',
  styleUrls: ['./form-kelola-dokumen.component.scss'],
})
export class FormKelolaDokumenComponent implements OnInit {
  listKategori = [
    {
      id: 0,
      kategori: 'Digital ID',
    },
    {
      id: 1,
      kategori: 'Banner',
    },
  ];
  listSubKategori = [
    {
      id: 0,
      sub_kategori: 'Subsidi',
    },
    {
      id: 1,
      sub_kategori: 'KTP',
    },
    {
      id: 2,
      sub_kategori: 'Akta Kematian',
    },
    {
      id: 3,
      sub_kategori: 'Banner',
    },
    {
      id: 4,
      sub_kategori: 'TNI AD',
    },
    {
      id: 5,
      sub_kategori: 'Passport',
    },
  ];
  listMenu = [
    {
      id: 0,
      menu: 'Subsidi',
    },
    {
      id: 1,
      menu: 'Sentra Kependudukan',
    },
    {
      id: 2,
      menu: 'Sentra Lokasi',
    },
    {
      id: 3,
      menu: 'Tidak Ada',
    },
  ];
  listSubMenu = [
    {
      id: 0,
      sub_menu: 'Subsidi',
    },
    {
      id: 1,
      sub_menu: 'Akta Kematian',
    },
    {
      id: 2,
      sub_menu: 'Paspor',
    },
    {
      id: 3,
      sub_menu: 'KTP',
    },
    {
      id: 4,
      sub_menu: 'Tidak Ada',
    },
  ];
  listAdjudikasi = [
    {
      id: 1,
      adjudikasi: 'Ya',
    },
    {
      id: 0,
      adjudikasi: 'Tidak',
    },
  ];
  listStatus = [
    {
      id: 1,
      status: 'Aktif',
    },
    {
      id: 0,
      status: 'Tidak Aktif',
    },
  ];
  searchDokumen: any | null;
  namaGambar!: string;
  namaIkon!: string;
  fileGambar: any | null;
  fileIkon: any | null;
  listFormulirFull: any;
  @Input() listFormulir: any;
  @Input() dokumenInput: any;
  @Output() afterSave = new EventEmitter<boolean>();

  mode!: string;
  formModel!: {
    m_form_id: number | null;
    alias_formulir: string | null;
    menu: string | null;
    sub_menu: string | null;
    instansi: string | null;
    adjudikasi: number | null;
    status: number | null;
    ikon: any | null;
    kategori: string | null;
    sub_kategori: string | null;
    gambar: any | null;
  };

  constructor(
    private sanitizer: DomSanitizer,
    private landaService: LandaService,
    private dokumenService: DokumenService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.listFormulirFull = this.listFormulir;
    this.searchDokumen = null;
    this.initDokumen();
  }

  initDokumen() {
    if (this.dokumenInput) {
      this.mode = 'update';
      const tempGambar = this.dokumenInput.gambar.split('/');
      this.namaGambar = tempGambar[tempGambar.length - 1];
      this.formModel = {
        m_form_id: this.dokumenInput.m_form_id,
        alias_formulir: this.dokumenInput.alias_formulir,
        menu: this.dokumenInput.menu,
        sub_menu: this.dokumenInput.sub_menu,
        instansi: this.dokumenInput.instansi,
        adjudikasi: this.dokumenInput.adjudikasi,
        status: this.dokumenInput.status,
        ikon: this.dokumenInput.ikon,
        kategori: this.dokumenInput.kategori,
        sub_kategori: this.dokumenInput.sub_kategori,
        gambar: this.dokumenInput.gambar,
      };
      this.fileGambar = this.dokumenInput.gambar;
      this.fileIkon = this.dokumenInput.ikon;
    } else {
      this.mode = 'create';
      this.namaGambar = 'Pilih Gambar';
      this.formModel = {
        m_form_id: null,
        alias_formulir: null,
        menu: null,
        sub_menu: null,
        instansi: null,
        adjudikasi: null,
        status: null,
        ikon: null,
        kategori: null,
        sub_kategori: null,
        gambar: null,
      };
      this.fileGambar = null;
      this.fileIkon = null;
    }
  }

  clickInput(id : any) {
    document.getElementById(id)?.click();
  }

  save() {
    if (this.mode == 'create') {
      this.dokumenService.createDocument(this.formModel).subscribe(
        (res: any) => {
          this.landaService.alertSuccess('Berhasil', res.message);
          this.afterSave.emit();
        },
        (err) => {
          this.landaService.alertError('Mohon Maaf', err.message);
        }
      );
    } else {
      if (typeof this.formModel.gambar == 'string') {
        delete this.formModel.gambar;
      }
      if (typeof this.formModel.ikon == 'string') {
        delete this.formModel.ikon;
      }
      this.dokumenService
        .updateDocument(this.formModel, this.dokumenInput.id)
        .subscribe(
          (res: any) => {
            this.landaService.alertSuccess('Berhasil', res.message);
            this.afterSave.emit();
          },
          (err) => {
            this.landaService.alertError('Mohon Maaf', err.message);
          }
        );
    }
  }

  close() {
    this.afterSave.emit();
  }

  handleUpload(event : any, type : any) {
    if (type == 'gambar') {
      this.namaGambar = event.target.files[0].name;
    } else if (type == 'ikon') {
      this.namaIkon = event.target.files[0].name;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (type == 'gambar') {
        this.fileGambar = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${reader.result}`
        );
        this.formModel.gambar = event.target.files[0];
      } else if (type == 'ikon') {
        this.fileIkon = this.sanitizer.bypassSecurityTrustResourceUrl(
          `${reader.result}`
        );
        this.formModel.ikon = event.target.files[0];
      }
    };
  }

  deleteIkon() {
    this.fileIkon = null;
    this.formModel.ikon = null;
  }

  tambahMenu() {
    console.log('tambahMenu');
  }

  searchListDokumen() {
    const temp : any = [];
    this.listFormulirFull.forEach((element: any) => {
      if (
        element.form_title
          .toLowerCase()
          .includes(this.searchDokumen.toLowerCase())
      ) {
        temp.push(element);
      }
    });
    console.log(temp);
    this.listFormulir = temp;
  }
}
