import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { DecryptionService } from "./decryption.service";


@Injectable({
  providedIn: 'root'
})
export class IpService {
  // get api url
  private apiUrl = this.decryptionService.GrabEnvironmentKey('apiUrl') + '/ip';
  // private apiUrl = 'https://ipinfo.io/ip';

  constructor(
    private http: HttpClient,
    private decryptionService: DecryptionService
  ) { }

  GetIpAddress() {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }

  SetIpAddress(ipAddress: string) {
    localStorage.setItem('ipAddress', ipAddress);
  }

  GetIpAddressFromLocalStorage() {
    return localStorage.getItem('ipAddress') || '115.85.90.229';
  }
}
