import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root'
})
export class FormulirService {
  constructor(private landaServ: LandaService) { }

  getFormulir(arrParameter = {}) {
    return this.landaServ.DataGet('/Formulir/List', arrParameter);
  }

  getList(params : any) {
    return this.landaServ.DataGet('/Formulir/List', params);
  }

  getDetail(id : any) {
    return this.landaServ.DataGet('/Formulir/' + id);
  }

  addFormulir(data : any) {
    return this.landaServ.DataPost('/Formulir', data, false);
  }

  editFormulir(data : any, id : any) {
    return this.landaServ.DataPut('/Formulir/' + id, data, false);
  }

  deleteFormulir(id : any) {
    return this.landaServ.DataDelete('/Formulir/' + id);
  }

}
