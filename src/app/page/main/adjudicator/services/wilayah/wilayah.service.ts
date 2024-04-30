import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// export class WilayahService extends LandaService {
export class WilayahService {
  constructor(private http: HttpClient) { }

  getProvinsi(search: any) {
    // return this.DataGet('/master/provinsi?limit=100&page=1&search=' + search);
    return this.http.get('https://dev-inisa.loyalto.id/master/provinsi?limit=100&page=1&search=' + search);
  }

  getKabupaten(search: any) {
    // return this.DataGet('/master/kabupaten?limit=100&page=1&search=' + search);
    return this.http.get('https://dev-inisa.loyalto.id/master/kabupaten?limit=100&page=1&search=' + search);
  }

  getKecamatan(search: any) {
    return this.http.get('https://dev-inisa.loyalto.id/master/kecamatan?limit=100&page=1&search=' + search);
    // return this.DataGet('/master/kecamatan?limit=100&page=1&search=' + search);
  }

  getKelurahan(search: any) {
    return this.http.get('https://dev-inisa.loyalto.id/master/desa?limit=100&page=1&search=' + search);
    // return this.DataGet('/master/desa?limit=100&page=1&search=' + search);
  }
}
