import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { DecryptionService } from 'src/app/core/services/decryption.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorScheduleService {
  dhiSecret: any;

  constructor(
    private landaService: LandaService,
    private decryptionService: DecryptionService,
  ) {
    this.getTokenTransmed()
  }

  getTokenTransmed() {
    const rareToken = this.decryptionService.decrypt(localStorage.getItem('dhi')!);
    this.dhiSecret = JSON.parse(rareToken);
  }

  getDoctorSchedule(filter: Object): Promise<any> {
    return this.landaService.DataGetLocal('http://10.10.1.44:8101/web-faskes/doctorsSchedules', filter, "keycloak", {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    }).toPromise();
  }

  deleteDoctorSchedule(id: any): Promise<any> {
    return this.landaService.DataDeleteLocal('http://10.10.1.44:8101/web-faskes/doctorsSchedules/' + id, {}, "keycloak", {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    }).toPromise();
  }

  updateDoctorSchedule(id: any, data: any): Promise<any> {
    return this.landaService.DataPutLocal('http://10.10.1.44:8101/web-faskes/doctorsSchedules/' + id, data, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    }).toPromise();
  }

  createDoctorSchedule(data: any): Promise<any> {
    return this.landaService.DataPostLocal('http://10.10.1.44:8101/web-faskes/doctorsSchedules', data, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    }).toPromise();
  }
}
