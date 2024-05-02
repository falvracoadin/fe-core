import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DecryptionService {
  constructor() { }

  private secretKey = 'LBBBXrILUmSZiGUnAZwXLlDS6dAtHp0i';

  GrabEnvironmentKey(envKey: any): any {
    try {
      const envValue = environment[envKey];
      if (typeof envValue !== 'string') {
        return envValue;
      } else {
        const bytes = AES.decrypt(envValue, this.secretKey);
        return bytes.toString(enc.Utf8);
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
  
  encrypt(val: string): string {
    const bytes = AES.encrypt(val, this.secretKey);
    return bytes.toString()
  }

  decrypt(val: string): string {
    const bytes = AES.decrypt(val, this.secretKey);
    return bytes.toString(enc.Utf8)
  }
}
