import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root',
})
export class DokumenService extends LandaService {
  getDocument(role: any, arrParameter = {}) {
    return this.DataGet('/Document/List', arrParameter);
  }

  createDocument(arrParameter = {}) {
    return this.DataPost('/Document', arrParameter);
  }

  updateDocument(arrParameter = {}, id : any) {
    return this.DataPut('/Document/' + id, arrParameter);
  }

  deleteDokumen(id : any) {
    return this.DataDelete('/Document/' + id);
  }
}
