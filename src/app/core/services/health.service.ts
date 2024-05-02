import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DecryptionService } from './decryption.service';

@Injectable({
    providedIn: 'root',
})

export class HealthService {
    apiURL = this.decryptionService.GrabEnvironmentKey('apiURL');
    // localUrl = this.decryptionService.GrabEnvironmentKey('localUrl');
    appId = this.decryptionService.GrabEnvironmentKey('appId');
    userToken: any;
    httpOptions: any;

    constructor(
        private http: HttpClient,
        private decryptionService: DecryptionService
    ) { }

    ngOnInit(): void { }

    /**
     * Generate link downloader
     */
    DownloadLink(path: string, params = {}) {
        let queryParams = new URLSearchParams(this.removeNull(params)).toString();
        window.open(this.apiURL + path + '?' + queryParams);
    }

    /**
     * Remove null data from query params
     */
    removeNull(params :any = {}) {
        let filledParams : any = {};
        for (const key in params) {
            if (params[key]) {
                filledParams[key] = params[key];
            }
        }

        return filledParams;
    }

    /**
     * Request GET
     */
    DataGet(path: string, payloads : any = {}, header : any = {}) {
        let clearParams : any= {};
        for (const key in payloads) {
            if (payloads[key]) clearParams[key] = payloads[key];
        }

        return this.http.get(this.apiURL + path, {
            params: clearParams,
            headers: header,
        });
    }

    DataGetLocal(path: string, payloads : any = {}, header : any = {}) {
        let clearParams : any= {};
        for (const key in payloads) {
            if (payloads[key]) clearParams[key] = payloads[key];
        }

        return this.http.get(path, {
            params: clearParams,
            headers: header,
        });
    }

    /**
     * Request POST
     */
    DataPost(path: string, payloads : any = {}, isFormType: boolean = true, header : any = {}) {
        let reqHeader = this.httpOptions ?? { headers: {} }

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

        /* mapping header */
        for (const key in header) {
            reqHeader.headers[key] = header[key];
        }

        return this.http.post(this.apiURL + path, isFormType ? formData : payloads, reqHeader);
    }

    /**
     * Request PUT
     */
    DataPut(path: string, payloads : any = {}, isFormType: boolean = true, header : any = {}) {
        let reqHeader = this.httpOptions ?? { headers: {} };
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

        /* mapping header */
        for (const key in header) {
            reqHeader.headers[key] = header[key];
        }

        return this.http.put(this.apiURL + path, isFormType ? formData : payloads, reqHeader);
    }

    /**
    * Request DELETE
    */
    DataDelete(path: string, payloads : any = {}, header : any = {}) {
        return this.http.delete(this.apiURL + path, {
            params: payloads,
            headers: header,
        });
    }
}