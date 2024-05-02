import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends LandaService {

  getDocumentDashboard(arrParameter = {}) {
    return this.DataGet('/dashboard', arrParameter);
  }
}
