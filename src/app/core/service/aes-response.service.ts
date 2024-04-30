import { Injectable } from '@angular/core';
import { AES, enc, pad } from "crypto-js";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AesResponseService {

  constructor() { }

  private secretKey = environment.secretHashKey;
  private secretKeyAdj = environment.secretHashKeyAdj;

  encrypt(str: string) {
    const key = enc.Utf8.parse(this.secretKey);
    const iv = enc.Utf8.parse("1234567812345678");
    let encrypted = AES.encrypt(str, key, {
      iv: iv,
      padding: pad.Pkcs7,
    });
    return encrypted.toString();
  }

  decrypt(str: string) {
    const key = enc.Utf8.parse(this.secretKey);
    const iv = enc.Utf8.parse("1234567812345678");
    let encrypted = AES.decrypt(str.toString(), key, {
      iv: iv,
      padding: pad.Pkcs7,
    });
    return encrypted.toString(enc.Utf8);
  }

  decryptAdj(str: string) {
    const key = enc.Utf8.parse(this.secretKeyAdj);
    const iv = enc.Utf8.parse("1234567812345678");
    let encrypted = AES.decrypt(str.toString(), key, {
      iv: iv,
      padding: pad.Pkcs7,
    });
    return encrypted.toString(enc.Utf8);
  }

  decryptJSON(str: string) {
    return JSON.parse(this.decrypt(str));
  }

  decryptResponse(response: string) {
    let jsonResp = JSON.parse(response);
    if (jsonResp.data !== undefined) {
      jsonResp.data = JSON.parse(this.decrypt(jsonResp.data));
    }
    if (jsonResp.Data !== undefined) {
      jsonResp.Data = JSON.parse(this.decrypt(jsonResp.Data));
    }
    return jsonResp;
  }

  decryptGoValidatorResponse(message: any) {
    let response = this.decrypt(message);
    response =
      response.includes("[") || response.includes("{")
        ? JSON.parse(response)
        : response;
    return response;
  }

  decryptGoValidatorResponseAdj(message: any) {
    let response = this.decryptAdj(message);
    return response;
  }
}
