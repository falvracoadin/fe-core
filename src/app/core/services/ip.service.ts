import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  private apiUrl = 'https://ipinfo.io/ip';

  constructor(
      private http: HttpClient
  ) { }

  getIpAddress() {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }

  setIpAddress(ipAddress: string) {
    localStorage.setItem('ipAddress', ipAddress);
  }

  getIpAddressFromLocalStorage() {
      return localStorage.getItem('ipAddress');
  }
}
