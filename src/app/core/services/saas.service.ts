import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DecryptionService } from './decryption.service';

@Injectable({
    providedIn: 'root',
})

export class SaasService {
    apiURL = this.decryptionService.GrabEnvironmentKey('saasUrl');
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
    removeNull(params : any = {}) {
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
    DataGet(path: string, payloads : any = {}, header = null) {
        let option : any = {}
        let clearParams : any = {};
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

    // DataGetLocal(path: string, payloads : any = {}, isLocal: boolean) {
    //     let clearParams = {};
    //     for (const key in payloads) {
    //         if (payloads[key]) clearParams[key] = payloads[key];
    //     }
    //
    //     if (isLocal) {
    //         return this.http.get(this.localUrl + path, {
    //             params: clearParams,
    //         });
    //     }else{
    //         return this.http.get(this.apiURL + path, {
    //             params: clearParams,
    //         });
    //     }
    // }

    /**
     * Request POST
     */
    DataPost(path: string, payloads : any = {}, isFormType: boolean = true, header: any = null) {
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
    DataPut(path: string, payloads : any = {}, isFormType: boolean = true) {
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
    DataDelete(path: string, payloads : any = {}) {
        return this.http.delete(this.apiURL + path, {
            params: payloads,
        });
    }
}
