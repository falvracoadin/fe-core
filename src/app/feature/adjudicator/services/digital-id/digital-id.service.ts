import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root'
})
export class DigitalIdService extends LandaService {

  getDocument(role: any, arrParameter = {}) {
    if (role.superadmin) {
      return this.DataGet('/listadjudicator', arrParameter);
    } else if (role.supervisor) {
      return this.DataGet('/organization-user-approval/list', arrParameter);
    } else {
      return this.DataGet('/organizationuser/list', arrParameter);
    }
  }

  getDocumentById(id: any) {
    return this.DataGet('/detail-adjudicator/' + id);
  }

  getPicCroppingKTP(nik: any) {
    return this.DataGet('/document/pic-cropping/' + nik);
  }

  updateDocument(document: any) {
    return this.DataPut('/adjudicator/' + document.DocAdjId, document);
  }

  validateDocument(document: any) {
    return this.DataPut('/adjudicator/' + document.DocAdjId + '/validation', document, false);
  }

  callCustomerCare() {
    window.open("https://wa.me/6281119903437", "_blank")
  }
}
