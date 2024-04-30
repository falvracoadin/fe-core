import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: 'root'
})
export class AesService {
  constructor() {
  }

  decrypt(str: string) {
    try {
      const data = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(str),
        blockSize: 128,
      })
      const decrypted = CryptoJS.AES.decrypt(
        data,
        CryptoJS.enc.Utf8.parse("afc08d84f2ea8183cd19a3b36f158f0f"),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      ).toString(CryptoJS.enc.Utf8);
      
      console.log(decrypted);

      return decrypted;
    } catch (e) {
      return console.error(e);
    }
  }
}
