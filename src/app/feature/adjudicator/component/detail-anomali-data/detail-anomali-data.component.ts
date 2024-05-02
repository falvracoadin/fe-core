import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnomaliDataService } from '../../services/anomali-data/anomali-data.service';
import { DigitalIdService } from '../../services/digital-id/digital-id.service';

@Component({
  selector: 'app-detail-pembaruan-aplikasi',
  templateUrl: './detail-anomali-data.component.html',
  styleUrls: ['./detail-anomali-data.component.scss']
})
export class DetailAnomaliDataComponent implements OnInit {

  id: any;
  document: any;
  notes: any;
  listViewInfo: any;
  docName: any;

  constructor(
    private route: ActivatedRoute,
    private anomaliDataService: AnomaliDataService,
    private digitalIdService: DigitalIdService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.document = {};
      this.getDocument();
      // this.setComponentData();
    }
  }

  setComponentData() {
    // this.listViewInfo = {
    //   'Detail Identitas' : [
    //     {label: 'NIK', bind: 'nik'},
    //     {label: 'NO. KK', bind: 'no_kk'},
    //     {label: 'Nama Lengkap', bind: 'doc_name'},
    //     {label: 'Tempat Lahir', bind: 'doc_pob'},
    //     {label: 'Tanggal Lahir', bind: 'doc_dob'},
    //     {label: 'Jenis Kelamin', bind: 'doc_gender'},
    //     {label: 'Status Keluarga', bind: 'status_keluarga'},
    //     {label: 'Agama', bind: 'doc_religion'},
    //     {label: 'Status Kawin', bind: 'status_kawin'},
    //     {label: 'Pend. Akhir', bind: 'pendidikan_terakhir'},
    //     {label: 'Pekerjaan', bind: 'doc_profession'},
    //     {label: 'Golongan Darah', bind: 'doc_blood'},
    //     {label: 'Alamat', bind: 'doc_address'},
    //     {label: 'RT', bind: 'rt'},
    //     {label: 'RW', bind: 'rw'},
    //     {label: 'Provinsi', bind: 'provinsi'},
    //     {label: 'Kota', bind: 'kotamadya_kab'},
    //     {label: 'Kecamatan', bind: 'doc_kecamatan'},
    //     {label: 'Kelurahan/Desa', bind: 'doc_kel_desa'},
    //     {label: 'Dusun', bind: 'dusun'},
    //     {label: 'No. Akta Lahir', bind: 'no_akta_lahir'},
    //     {label: 'No. Akta Kawin', bind: 'no_akta_kawin'},
    //     {label: 'Tanggal Kawin', bind: 'tgl_kawin'},
    //     {label: 'No. Akta Cerai', bind: 'no_akta_cerai'},
    //     {label: 'NIK Ayah', bind: 'nik_ayah'},
    //     {label: 'Nama Ayah', bind: 'nama_ayah'},
    //     {label: 'NIK Ibu', bind: 'nik_ibu'},
    //     {label: 'Nama Ibu', bind: 'nama_ibu'},
    //   ]
    // };

    if (this.document.doc_card_type === '2') {
      // KTP
      this.listViewInfo = {
        'Detail Identitas': [
          {label: 'NIK', bind: 'nik'},
          {label: 'No. KK', bind: 'no_kk'},
          {label: 'Nama Lengkap', bind: 'doc_name'},
          {label: 'Tempat Lahir', bind: 'doc_pob'},
          {label: 'Tgl. Lahir', bind: 'doc_dob'},
          {label: 'Jenis Kelamin', bind: 'doc_gender'},
          {label: 'Status Keluarga', bind: 'status_keluarga'},
          {label: 'Agama', bind: 'doc_religion'},
          {label: 'Status Kawin', bind: 'doc_marital'},
          {label: 'Pend. Akhir', bind: 'pendidikan_terakhir'},
          {label: 'Pekerjaan', bind: 'doc_profession'},
          {label: 'Gol. Darah', bind: 'doc_blood'},
          {label: 'Alamat', bind: 'doc_address'},
          {label: 'RT', bind: 'rt'},
          {label: 'RW', bind: 'rw'},
          {label: 'Dusun', bind: 'dusun'},
          {label: 'Kelurahan', bind: 'doc_kel_desa'},
          {label: 'Kecamatan', bind: 'doc_kecamatan'},
          {label: 'Kota / Kab', bind: 'kotamadya_kab'},
          {label: 'Provinsi', bind: 'provinsi'},
          {label: 'Kode Pos', bind: 'kode_pos'},
          {label: 'No. Akta Lahir', bind: 'no_akta_lahir'},
          {label: 'No. Akta Kawin', bind: 'no_akta_kawin'},
          {label: 'Tgl. Kawin', bind: 'tgl_kawin'},
          {label: 'No. Akta Cerai', bind: 'no_akta_cerai'},
          {label: 'NIK Ayah', bind: 'nik_ayah'},
          {label: 'Nama Ayah', bind: 'nama_ayah'},
          {label: 'NIK Ibu', bind: 'nik_ibu'},
          {label: 'Nama Ibu', bind: 'nama_ibu'},
        ],
      };
    } else if (this.document.doc_card_type === '7') {
      // KRS
      this.listViewInfo = {
        'Detail Identitas': [
          {label: 'NIK', bind: 'nik'},
          {label: 'Nama Lengkap', bind: 'doc_name'},
          {label: 'Tgl. Lahir', bind: 'doc_dob'},
          {label: 'Nama Rumah Sakit', bind: 'doc_hospital_name'},
          {label: 'Alamat Rumah Sakit', bind: 'doc_hospital_address'},
        ],
      };
    }
  }

  getDocument() {
    this.anomaliDataService.getDataAnomaliById(this.id).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.document = res.data;
        this.docName = this.document.doc_name.split(' ')[0];
        this.setComponentData();
      }
    });
  }

  getDateFormat(date: string): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)}-${d.getDate()}`;
  }

  getKeyObject(object : any) {
    return Object.keys(object);
  }

  isBase64(str : any) {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }

  callCenter() {
    this.digitalIdService.callCustomerCare();
  }
}
