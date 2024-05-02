import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { DecryptionService } from 'src/app/core/services/decryption.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplateChatService {
  dhiSecret: any;
  constructor(
    private landaService: LandaService,
    private decryptionService: DecryptionService,
  ) {

    this.getTokenTransmed()
  }

  getTokenTransmed() {
    const token = localStorage.getItem('dhi');
    if(token !== null){
      const rareToken = this.decryptionService.decrypt(token);
      this.dhiSecret = JSON.parse(rareToken);
    }
  }

  listTemplateChat(filter: object) {
    return this.landaService.DataGet('/web-faskes/templateChats', filter, "keycloak", {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    }).toPromise();
  }

  createTemplateChat(data: any) {
    return this.landaService.DataPost('/web-faskes/templateChats', data, false, "keycloak", {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    }).toPromise();
  }

  updateTemplateChat(id: any, data: any) {
    return this.landaService.DataPut('/web-faskes/templateChats/' + id, data, false, "keycloak", {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    }).toPromise();
  }
}
