import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root',
})
export class FormulirService extends LandaService {
  getFormulir(arrParameter = {}) {
    return this.DataGet('/Formulir/List', arrParameter);
  }
}
