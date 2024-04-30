import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Observable, throwError, timer } from 'rxjs';
import Swal from 'sweetalert2';
import { RsaService } from "./rsa.service";
import { DecryptionService } from "./decryption.service";
import { add } from 'ngx-bootstrap/chronos';

@Injectable({
    providedIn: 'root'
})
export class VenturoService {
    apiUrl = this.decryptionService.GrabEnvironmentKey('apiUrl');

    constructor(
        private http: HttpClient,
        private rsaService: RsaService,
        private decryptionService: DecryptionService
    ) {
    }

    DataGet(url: string, params: any = {}) {
        let param: any = {};
        for (const key in params) {
            if (params[key]) param[key] = params[key];
        }

        return this.http.get((url.indexOf('http') == 0 ? '' :  this.apiUrl) + url, {
            params: param,
        });
    }

    DataGetLocal(url: string, params: any = {}) {
        let param: any = {};
        for (const key in params) {
            if (params[key]) param[key] = params[key];
        }
        return this.http.get(url, {
            params: param,
        });
    }

    DataGetDownload(url: string, params: any = {}) {
        let param: any = {};
        for (const key in params) {
            if (params[key]) param[key] = params[key];
        }

        return this.http.get((url.indexOf('http') == 0 ? '' :  this.apiUrl) + url, {
            params: param,
            responseType: 'arraybuffer'
        });
    }

    DataGetDownloadLocal(url: string, params: any = {}) {
        let param: any = {};
        for (const key in params) {
            if (params[key]) param[key] = params[key];
        }

        return this.http.get(url, {
            params: param,
            responseType: 'arraybuffer'
        });
    }

    DataPost(url: string, payloads: any = {}, isFormData = false, isSignature: boolean = true) {
        let formData = new FormData();
        let Options = {}

        if (isSignature) {
            const signature = this.rsaService.signMessage(payloads, true);
            //set signature to header of http post
            Options = {
                headers: new HttpHeaders({
                    'X-Pyl-Signature': signature.toString()
                })
            }
        }

        if (isFormData) {
            for (const key in payloads) {
                if (payloads[key]) formData.append(key, payloads[key]);
            }
        }


        return this.http.post(url.indexOf('http://') == 0 ? url : this.apiUrl + url, isFormData ? formData : payloads, Options);
    }

    DataPostLocal(url: string, payloads: any = {}, isFormData = false, isSignature: boolean = true) {
        let formData = new FormData();
        let Options = {}

        if (isSignature) {
            const signature = this.rsaService.signMessage(payloads, true);
            //set signature to header of http post
            Options = {
                headers: new HttpHeaders({
                    'X-Pyl-Signature': signature.toString()
                })
            }
        }

        if (isFormData) {
            for (const key in payloads) {
                if (payloads[key]) formData.append(key, payloads[key]);
            }
        }


        return this.http.post(url, isFormData ? formData : payloads, Options);
    }

    DataPut(url: string, payloads: any = {}, isFormData = false, isSignature: boolean = true) {
        let formData = new FormData();
        let Options = {}

        if (isSignature) {
            const signature = this.rsaService.signMessage(payloads, true);
            //set signature to header of http post
            Options = {
                headers: new HttpHeaders({
                    'X-Pyl-Signature': signature.toString()
                })
            }
        }

        if (isFormData) {
            for (const key in payloads) {
                if (payloads[key]) formData.append(key, payloads[key]);
            }
        }

        return this.http.put(this.apiUrl + url, isFormData ? formData : payloads, Options);
    }

    DataPutLocal(url: string, payloads: any = {}, isFormData = false, isSignature: boolean = true) {
        let formData = new FormData();
        let Options = {}

        if (isSignature) {
            const signature = this.rsaService.signMessage(payloads, true);
            //set signature to header of http post
            Options = {
                headers: new HttpHeaders({
                    'X-Pyl-Signature': signature.toString()
                })
            }
        }

        if (isFormData) {
            for (const key in payloads) {
                if (payloads[key]) formData.append(key, payloads[key]);
            }
        }

        return this.http.put(url, isFormData ? formData : payloads, Options);
    }

    DataPutCustom(url: string, payloads: any = {}, isFormData = false, isSignature: boolean = true, headers: any = {}) {
        let formData = new FormData();
        let Options = {}

        if (isSignature) {
            const signature = this.rsaService.signMessage(payloads, true);
            //set signature to header of http post
            Options = {
                headers: new HttpHeaders({
                    'X-Pyl-Signature': signature.toString(),
                    ...headers
                })
            }
        }

        if (isFormData) {
            for (const key in payloads) {
                if (payloads[key]) formData.append(key, payloads[key]);
            }
        }

        return this.http.put(url, isFormData ? formData : payloads, Options);
    }

    DataPatch(url: string, payloads: any = {}, isFormData = false, isSignature: boolean = true) {
        let formData = new FormData();

        // generate signature of payload, then set header "X-Pyl-Signature"
        if (isSignature) {
            const signature = this.rsaService.signMessage(payloads, true);
            formData.append('X-Pyl-Signature', signature.toString());
        }

        if (isFormData) {
            for (const key in payloads) {
                if (payloads[key]) formData.append(key, payloads[key]);
            }
        }

        return this.http.patch(this.apiUrl + url, isFormData ? formData : payloads);
    }

    DataDelete(url: string) {
        return this.http.delete(this.apiUrl + url);
    }

    DeleteDataByIdAndParams(url: string, params: any = {}) {
        let param: any = {};
        for (const key in params) {
            if (params[key]) param[key] = params[key];
        }

        return this.http.delete(this.apiUrl + url, {
            params: param,
        });
    }

    DataDeleteLocal(url: string) {
        return this.http.delete(url);
    }

    DataDeleteZiswaf(url: string, data: any) {
        let formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }

        const httpOptions = {
            body: formData
        };

        return this.http.request('delete', this.apiUrl + url, httpOptions);
    }

    DataDeleteZiswafLocal(url: string, data: any) {
        let formData = new FormData();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }

        const httpOptions = {
            body: formData
        };

        return this.http.request('delete', url, httpOptions);
    }

    UploadFileToMinio(file: any, path: string) {
        const headers = new HttpHeaders({
            'Api-Key': this.decryptionService.GrabEnvironmentKey('saasMinioApiKey'),
            enctype: 'multipart/form-data',
        });

        const formData = new FormData();
        formData.append('object', file);
        formData.append('path', path);
        formData.append('bucket', this.decryptionService.GrabEnvironmentKey('saasMinioBucket'));

        return this.http.post(this.decryptionService.GrabEnvironmentKey("saasMinioUrl") + '/upload', formData, { headers });
    }

    DownloadFileFromMinio(path: string, object: string) {
        const headers = new HttpHeaders({
            'Api-Key': this.decryptionService.GrabEnvironmentKey("saasMinioApiKey"),
        });

        const params = new HttpParams().set('path', path).append('object', object).append('bucket', this.decryptionService.GrabEnvironmentKey("saasMinioBucket"));

        return this.http.get(this.decryptionService.GrabEnvironmentKey("saasMinioUrl") + '/download', { headers, params }).pipe(
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

    extractExtension(filename: any) {
        // Get the file name from the event object
        const fileName = filename;

        // Get the last 5 characters of the file name
        const lastFiveCharacters = fileName.slice(-5);

        // Split the last five characters using a period as the delimiter
        const splitResult = lastFiveCharacters.split('.');

        // Get the last split
        return splitResult[splitResult.length - 1];
    }

    alertSuccess(title: any, content: any, timer = 3.5) {
        Swal.fire({
            title,
            text: content,
            icon: 'success',
            timer: timer * 1000,
            showConfirmButton: true,
        });
    }

    alertSuccessNew(timer = 3.5) {
        Swal.fire({
            title: '<img src="assets/image/Illustration-success.png" style="width:128px;height:128px;margin:0 auto;"> <br>Berhasil Menyimpan Data',
            html: '<p>Data yang kamu ubah berhasil disimpan</p>',
            timer: timer * 1000,
            showConfirmButton: false,
        });
    }

    alertError(title: any, content: any) {
        let isi = '';
        if (Array.isArray(content) === true) {
            content.forEach(function (element: any) {
                isi += `${element} <br>`;
            });
        } else if (typeof content === 'object') {
            for (const key in content) {
                isi += `${content[key]} <br>`;
            }
        } else {
            isi = String(content);
        }
        Swal.fire(title, isi, 'error');
    }

    toastSuccess(title: any, content: any, timer = 3.5) {
        Swal.fire({
            title,
            text: content,
            icon: 'success',
            timer: timer * 1000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
        });
    }

    toastError(title: any, content: any, timer = 3.5) {
        Swal.fire({
            title,
            text: content,
            icon: 'error',
            timer: timer * 1000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
        });
    }

    toastWarning(title: any, content: any, timer = 3.5) {
        Swal.fire({
            title,
            text: content,
            icon: 'warning',
            timer: timer * 1000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
        });
    }

    toastInfo(title: any, content: any, timer = 3.5) {
        Swal.fire({
            title,
            text: content,
            icon: 'info',
            timer: timer * 1000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
        });
    }

    /**
     * 
     * @param addDate milisecond
     * @returns YYYY-MM-DD HH:mm:ss
     */
    getCurrentDateTime(addDate: number = 0) {
        let time: Date;
        if (addDate === 0) {
            time = new Date();
        } else {
            time = new Date(new Date().getTime() + addDate);
        }

        time = new Date(time.getTime() + (time.getTimezoneOffset() * 60000) + (7 * 60 * 60 * 1000));
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, '0'); // Ditambah 1 karena indeks bulan dimulai dari 0
        const day = String(time.getDate()).padStart(2, '0');

        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
