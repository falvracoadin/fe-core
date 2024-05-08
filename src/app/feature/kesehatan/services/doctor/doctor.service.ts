import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { DecryptionService } from 'src/app/core/services/decryption.service';
import { Observable } from 'rxjs';

/* interface declaration */
export enum StatusDoctor {
  ACTIVE,
  INACTIVE
}

export interface SaveSpecialistRequest {
  uuid: string;
  doctor_specialists: SaveSpecialistRequestDoctorspecialist[];
}

export interface SaveSpecialistRequestDoctorspecialist {
  slug: string;
  rate: number;
}

export interface SaveEducationRequest {
  education: string;
  graduation_year: string;
  uuid: string;
}

export interface SaveFacilityRequest {
  name: string;
  province_id: number;
  regency_id: number;
  uuid: string;
}

interface SaveDoctorRequest {
  full_name: string;
  gender: string;
  phone_number: string;
  no_str: string;
  email: string;
  province_id: number;
  regency_id: number;
  sip_date: string;
  start_experience: string;
  str_date: string;
  is_new: string;
  tags?: any[];
}

interface ListDoctorRequest {
  limit: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  dhiSecret: any;

  constructor(
    private landaService: LandaService,
    private decryptionService: DecryptionService,
  ) {
    this.getTokenTransmed()
  }

  getTokenTransmed() {
    const rareToken = this.decryptionService.decrypt(localStorage.getItem('dhi') as string);
    this.dhiSecret = JSON.parse(rareToken);
  }

  getProvince(): Observable<Object> {
    return this.landaService.DataGetLocal('http://10.10.1.44:8101/web-faskes/provinces', {}, "keycloak", {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  getRegion(provinceId: number): Observable<Object> {
    return this.landaService.DataGetLocal(`http://10.10.1.44:8101/web-faskes/regencies-province/${provinceId}`, {}, "keycloak", {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  saveSpecialist(req: SaveSpecialistRequest): Observable<Object> {
    return this.landaService.DataPostLocal(`http://10.10.1.44:8101/web-faskes/doctorsSpecialists`, req, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  saveEducation(req: SaveEducationRequest): Observable<Object> {
    return this.landaService.DataPostLocal(`http://10.10.1.44:8101/web-faskes/doctorsEducations`, req, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  saveFacility(req: SaveFacilityRequest): Observable<Object> {
    return this.landaService.DataPostLocal(`http://10.10.1.44:8101/web-faskes/doctorsFacilities`, req, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  saveImage(uuid: string, file: File) {
    const payload = new FormData();
    payload.append('image', file, file.name);

    return fetch(`http://10.10.1.44:8101/web-faskes/doctors/image/${uuid}`, {
      body: payload,
      method: 'POST',
      headers: {
        'TransmedToken': this.dhiSecret.token,
        'faskes-id': 'Mzg='
      },
    })
  }

  saveDoctor(req: SaveDoctorRequest): Observable<Object> {
    return this.landaService.DataPostLocal(`http://10.10.1.44:8101/web-faskes/doctors`, req, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  listDoctor(req: ListDoctorRequest): Observable<Object> {
    return this.landaService.DataGetLocal(`http://10.10.1.44:8101/web-faskes/doctorsMedicalFacility`, req, 'keycloak', {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  detailDoctorByStr(noStr: string): Observable<Object> {
    return this.landaService.DataGetLocal(`http://10.10.1.44:8101/web-faskes/doctorsNostr/` + noStr, {}, 'keycloak', {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  updateStatusDoctor(uuid: string): Observable<Object> {
    return this.landaService.DataPostLocal(`http://10.10.1.44:8101/web-faskes/doctors/inactive/${uuid}`, {}, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  activateDoctor(uuid: string): Observable<Object> {
    return this.landaService.DataPostLocal(`http://10.10.1.44:8101/web-faskes/doctors/active/${uuid}`, {}, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }

  getListSpecialist(): Observable<Object> {
    return this.landaService.DataGetLocal(`http://10.10.1.44:8101/web-faskes/specialists`, {}, false, {
      'TransmedToken': this.dhiSecret.token,
      'faskes-id': 'Mzg=',
    });
  }
}
