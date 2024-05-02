import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { LandaService } from '../../../core/services/landa.service'

@Injectable({ providedIn: 'root' })

export class ProfileService {
    constructor(
        private landaService: LandaService
    ) { }

    getProfile(): Observable<any> {
        return this.landaService.DataGet('/access/profile/get');
    }

    updateProfile(body:any, mode:any = null): Observable<any> {
        if(mode == "saas"){
            return this.landaService.DataPut("/access/v2/profile/edit", body, false, mode)
        }
        return this.landaService.DataPut('/access/profile/edit', body);
    }

    updateEmail(body :any, mode:any = null) : Observable<any> {
        if(mode == "saas"){
            return this.landaService.DataPut("/access/v2/profile/email/edit", body, false, mode)
        }
        return this.landaService.DataPut('/access/profile/edit', body);
    }

    changePassword(body : any, mode:any = null): Observable<any> {
        if(mode == "saas"){
            return this.landaService.DataPut("/access/v2/password/edit", body, mode)
        }
        return this.landaService.DataPut('/access/password/edit', body);
    }
}