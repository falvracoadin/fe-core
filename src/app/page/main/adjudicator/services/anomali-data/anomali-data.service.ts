import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root'
})

export class AnomaliDataService extends LandaService{

  getDataAnomali(filter: any){
    return this.DataGet('/listanomali', filter)
  }

  getDataAnomaliById(id: any){
    return this.DataGet('/detail-adjudicator/'+id)
  }
}
