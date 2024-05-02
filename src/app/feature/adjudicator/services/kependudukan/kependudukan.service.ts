import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root'
})
export class KependudukanService extends LandaService{

  getDataKependudukan(filter: any){
    return this.DataGet('/getDocument', filter)
  }

  getAktaLahirById(id : any){
    return this.DataGet('/akta-lahir.json')
  }

  getKependudukanKTPById(id: any){
    return this.DataGet('/Ktp/' + id)
  }

  updateStatusKonfirmasiKtp(id : any, payload: any){
    return this.DataPut('/ktpStatusKonfirmasi/' + id, payload)
  }

  updateJadwalKtp(payload: [any]){
    return this.DataPut('/ktpJadwal', payload, false)
  }

  updateDocument(id: any, payload){
    return this.DataPut('/Ktp/' + id, payload)
  }

  updateStatusVerfikasiKtp(id: any, payload: any){
    return this.DataPut('/ktpStatusVerifikasi/' + id, payload)
  }

  getKelurahan(kecamatanId: any){
    return this.DataGet('/getSubDistrict/' + kecamatanId)
  }
}
