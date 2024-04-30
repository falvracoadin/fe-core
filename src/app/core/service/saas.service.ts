import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";

import { Observable, throwError, timer } from "rxjs";
import { catchError, mergeMap, retryWhen } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { DecryptionService } from "./decryption.service";

@Injectable({
  providedIn: 'root'
})
export class SaasService {
  saasUrl = this.decryptionService.GrabEnvironmentKey('saasUrl');
  platform = this.decryptionService.GrabEnvironmentKey('platform');
  secret = this.decryptionService.GrabEnvironmentKey('secret');

  saasMinioUrl = this.decryptionService.GrabEnvironmentKey('saasMinioUrl');
  saasMinioApiKey = this.decryptionService.GrabEnvironmentKey('saasMinioApiKey')
  saasMinioBucket = this.decryptionService.GrabEnvironmentKey('saasMinioBucket')

  apiURL = this.decryptionService.GrabEnvironmentKey('saasUrl');
  // localUrl = this.decryptionService.GrabEnvironmentKey('localUrl');
  appId = this.decryptionService.GrabEnvironmentKey('appId');
  userToken: any;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private decryptionService: DecryptionService
  ) { }

  GetPlatformKey() {
    const platformKeypayload = {
      Platform: this.platform,
      Secret: this.secret,
    }

    return this.http.post(this.saasUrl + '/access/v2/initialization', platformKeypayload);
  }

  GetPlatformKeyFromLocalStorage() {
    return localStorage.getItem('platformKey') || '';
  }

  SetPlatformKey(platformKey: string) {
    localStorage.setItem('platformKey', platformKey);
  }

  UploadFileToMinio(file: any, path: string) {
    const headers = new HttpHeaders({
      'Api-Key': this.saasMinioApiKey,
      enctype: 'multipart/form-data',
    });

    const formData = new FormData();
    formData.append('object', file);
    formData.append('path', path);
    formData.append('bucket', this.saasMinioBucket);

    return this.http.post(this.saasMinioUrl + '/upload', formData, { headers });
  }

  /*
  * Generate link downloader
  */
  DownloadLink(path: string, params = {}) {
    let queryParams = new URLSearchParams(this.removeNull(params)).toString();
    window.open(this.apiURL + path + '?' + queryParams);
  }

  /**
      * Remove null data from query params
      */
  removeNull(params: any = {}) {
    let filledParams: any = {};
    for (const key in params) {
      if (params[key]) {
        filledParams[key] = params[key];
      }
    }

    return filledParams;
  }

  DataGet(path: string, payloads: any = {}, header: any = null) {
    let option: any = {}
    let clearParams: any = {};
    for (const key in payloads) {
      if (payloads[key]) clearParams[key] = payloads[key];
    }

    if (header != null) {
      option = {
        headers: header
      }
    } else {
      option = {
        headers: {
          "Content-Type": "application/json"
        }
      }
    }

    option["params"] = clearParams
    return this.http.get(this.apiURL + path, option);
  }

  DataPost(path: string, payloads: any = {}, isFormType: boolean = true, header: any = null) {
    let reqHeader = this.httpOptions

    let formData = new FormData()

    if (isFormType) {
      reqHeader = {
        headers: {
          "enctype": "multipart/form-data",
          "App-Id": this.decryptionService.GrabEnvironmentKey('appId'),
        }
      }
      for (const key in payloads) {
        formData.append(key, payloads[key])
      }
    }
    if (header != null) {
      reqHeader = {
        headers: header
      }
    }

    console.log(reqHeader);


    return this.http.post(this.apiURL + path, isFormType ? formData : payloads, reqHeader);
  }

  /**
       * Request PUT
       */
  DataPut(path: string, payloads: any = {}, isFormType: boolean = true) {
    let reqHeader = this.httpOptions;
    let formData = new FormData()

    if (isFormType) {
      reqHeader = {
        headers: {
          "enctype": "multipart/form-data",
          "App-Id": this.decryptionService.GrabEnvironmentKey('appId')
        }
      }
      for (const key in payloads) {
        formData.append(key, payloads[key])
      }
    }
    return this.http.put(this.apiURL + path, isFormType ? formData : payloads, reqHeader);
  }

  /**
  * Request DELETE
  */
  DataDelete(path: string, payloads = {}) {
    return this.http.delete(this.apiURL + path, {
      params: payloads,
    });
  }
  DownloadFileFromMinio(path: string, object: string) {
    const headers = new HttpHeaders({
      'Api-Key': this.saasMinioApiKey,
    });

    const params = new HttpParams().set('path', path).append('object', object).append('bucket', this.saasMinioBucket);

    return this.http.get(this.saasMinioUrl + '/download', { headers, params }).pipe(
      retryWhen((errors: Observable<any>) => {
        return errors.pipe(
          mergeMap((error, index) => {
            if (index < 3) {
              return timer(1000);
            }
            return throwError(error);
          })
        );
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
