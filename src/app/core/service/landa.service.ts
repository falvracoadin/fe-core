import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from "sweetalert2";
import { HealthService } from "./health.service";
import { SaasService } from "./saas.service";
import { param } from "jquery";
import { DecryptionService } from "./decryption.service";

@Injectable({
  providedIn: "root",
})
export class LandaService {
  apiURL = this.decryptionService.GrabEnvironmentKey("apiURL");
  apiURLKeycloak = this.decryptionService.GrabEnvironmentKey("apiURLKeycloak");
  localUrl = this.decryptionService.GrabEnvironmentKey("localUrl");
  mode = this.decryptionService.GrabEnvironmentKey("defaultMode");
  appId = this.decryptionService.GrabEnvironmentKey("appId");
  userToken: any;
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private healthService: HealthService,
    private saasService: SaasService,
    private decryptionService: DecryptionService
  ) {}
  ngOnInit(): void {}

  /**
   * Generate link downloader
   */
  DownloadLink(path: string, params = {}, mode : string|null = null) {
    if (mode == null) {
      mode = this.mode;
    }
    switch (mode) {
      case "saas":
        return this.saasService.DownloadLink(path, params);
      default:
        return this.healthService.DownloadLink(path, param);
    }
  }

  /**
   * Remove null data from query params
   */
  removeNull(params:any = {}) {
    let filledParams:any = {};
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
  DataGet(path: string, payloads = {}, mode : string|null = null, header = null) {
    if (mode == null) {
      mode = this.mode;
    }
    switch (mode) {
      case "saas":
        return this.saasService.DataGet(path, payloads, header);
      default:
        return this.healthService.DataGet(path, payloads);
    }
  }

  DataGetLocal(path: string, payloads : any = {}, isLocal: boolean) {
    const clearParams: any = {};
    for (const key in payloads) {
      if (payloads[key]) {
        clearParams[key] = payloads[key];
      }
    }

    if (isLocal) {
      return this.http.get(this.localUrl + path, {
        params: clearParams,
      });
    } else {
      return this.http.get(this.apiURL + path, {
        params: clearParams,
      });
    }
  }

  /**
   * Request POST
   */
  // DataPost(
  //   path: string,
  //   payloads = {},
  //   isFormType: boolean = true,
  //   mode = null,
  //   header = null
  // ) {
  //   if (mode == null) {
  //     mode = this.mode;
  //   }
  //   switch (mode) {
  //     case "saas":
  //       return this.saasService.DataPost(path, payloads, isFormType, header);
  //     default:
  //       return this.healthService.DataPost(path, payloads, isFormType);
  //   }
  // }

  DataPostLocal(
    path: string,
    payloads: any = {},
    isFormType: boolean = true,
    isLocal: boolean
  ) {
    let reqHeader = this.httpOptions;

    const formData = new FormData();

    if (isFormType) {
      reqHeader = {
        headers: {
          enctype: "multipart/form-data",
          "App-Id": this.decryptionService.GrabEnvironmentKey("appId"),
        },
      };
      for (const key in payloads) {
        formData.append(key, payloads[key]);
      }
    }

    if (isLocal) {
      return this.http.post(
        this.localUrl + path,
        isFormType ? formData : payloads,
        reqHeader
      );
    }

    return this.http.post(
      this.apiURL + path,
      isFormType ? formData : payloads,
      reqHeader
    );
  }

  DataPostCustom(path: string, payloads: any = {}, isFormType: boolean = true) {
    let reqHeader = this.httpOptions;

    const formData = new FormData();

    if (isFormType) {
      reqHeader = {
        headers: {
          enctype: "multipart/form-data",
          "App-Id": this.decryptionService.GrabEnvironmentKey("appId"),
        },
      };
      for (const key in payloads) {
        formData.append(key, payloads[key]);
      }
    }
    return this.http.post(path, isFormType ? formData : payloads, reqHeader);
  }

  /**
   * Request PUT
   */
  DataPut(
    path: string,
    payloads = {},
    isFormType: boolean = true,
    mode: string|null = null
  ) {
    if (mode == null) {
      mode = this.mode;
    }
    switch (mode) {
      case "saas":
        return this.saasService.DataPut(path, payloads, isFormType);
      default:
        return this.healthService.DataPut(path, payloads, isFormType);
    }
  }

  DataPutLocal(
    path: string,
    payloads: any = {},
    isFormType: boolean = true,
    isLocal: boolean
  ) {
    let reqHeader = this.httpOptions;
    const formData = new FormData();

    if (isFormType) {
      reqHeader = {
        headers: {
          enctype: "multipart/form-data",
          "App-Id": this.decryptionService.GrabEnvironmentKey("appId"),
        },
      };
      for (const key in payloads) {
        formData.append(key, payloads[key]);
      }
    }

    if (isLocal) {
      return this.http.put(
        this.localUrl + path,
        isFormType ? formData : payloads,
        reqHeader
      );
    }
    return this.http.put(
      this.apiURL + path,
      isFormType ? formData : payloads,
      reqHeader
    );
  }

  /**
   * Request DELETE
   */
  // DataDelete(path: string, payloads = {}, mode = null) {
  //   if (mode == null) {
  //     mode = this.mode;
  //   }
  //   switch (mode) {
  //     case "saas":
  //       return this.saasService.DataDelete(path, payloads);
  //     default:
  //       return this.healthService.DataDelete(path, payloads);
  //   }
  // }

  /**
   * Sweet alert Sukses
   */
  alertSuccess(title : string, content : any, timer = 3.5) {
    Swal.fire({
      title,
      text: content,
      icon: "success",
      timer: timer * 1000,
      showConfirmButton: true,
      confirmButtonColor: "#21409A",
    });
  }

  /**
   * Sweet alert warning
   */
  alertWarning(title : string, content : any, timer = 3.5) {
    Swal.fire({
      title,
      text: content,
      icon: "warning",
      timer: timer * 1000,
      showConfirmButton: true,
      confirmButtonColor: "#FFB97B",
    });
  }

  /**
   * Sweet alert info
   */
  alertInfo(title : string, content : any, timer = 3.5) {
    Swal.fire({
      title,
      text: content,
      icon: "info",
      timer: timer * 1000,
      showConfirmButton: true,
      confirmButtonColor: "#5CABFF",
    });
  }

  /**
   * Sweet alert error
   */
  alertError(title : string, content : any) {
    let isi = "";
    if (Array.isArray(content) === true) {
      content.forEach(function (element) {
        isi += `${element} <br>`;
      });
    } else if (typeof content === "object") {
      for (const key in content) {
        isi += `${content[key]} <br>`;
      }
    } else {
      isi = String(content);
    }
    // Swal.fire(title, isi, 'error');
    Swal.fire({
      title: title,
      text: isi,
      icon: "error",
      showConfirmButton: true,
      confirmButtonColor: "#CC1D15",
    });
  }

  UploadFileToMinio(file: any, path: string) {
    const headers = new HttpHeaders({
      "Api-Key": this.decryptionService.GrabEnvironmentKey("saasMinioApiKey"),
      enctype: "multipart/form-data",
    });

    const formData = new FormData();
    formData.append("object", file);
    formData.append("path", path);
    formData.append(
      "bucket",
      this.decryptionService.GrabEnvironmentKey("saasMinioBucket")
    );

    return this.http.post(
      this.decryptionService.GrabEnvironmentKey("saasMinioUrl") + "/upload",
      formData,
      { headers }
    );
  }

  DataGetKeycloak(path: string, payloads: any = {}) {
    let clearParams : any = {};
    for (const key in payloads) {
      if (payloads[key]) clearParams[key] = payloads[key];
    }

    return this.http.get(this.apiURLKeycloak + path, {
      params: clearParams,
    });
  }

  DataPostKeycloak(path: string, payloads : any = {}, isFormType: boolean = true) {
    let reqHeader = this.httpOptions;

    let formData = new FormData();

    if (isFormType) {
      reqHeader = {
        headers: {
          enctype: "multipart/form-data",
        },
      };
      for (const key in payloads) {
        formData.append(key, payloads[key]);
      }
    }

    return this.http.post(
      this.apiURLKeycloak + path,
      isFormType ? formData : payloads,
      reqHeader
    );
  }

  // DownloadFileFromMinio(path: string, object: string) {
  //     const headers = new HttpHeaders({
  //         'Api-Key': this.decryptionService.GrabEnvironmentKey('saasMinioApiKey'),
  //     });

  //     const params = new HttpParams().set('path', path).append('object', object).append('bucket', this.decryptionService.GrabEnvironmentKey('saasMinioBucket'));

  //     return this.http.get(this.decryptionService.GrabEnvironmentKey('saasMinioUrl') + '/download', { headers, params });
  // }

  // // TOAST
  // toastError(content) {
  //     const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 3000,
  //         timerProgressBar: true,
  //         didOpen: (toast) => {
  //           toast.addEventListener('mouseenter', Swal.stopTimer);
  //           toast.addEventListener('mouseleave', Swal.resumeTimer);
  //         }
  //       });

  //     Toast.fire({
  //         icon: 'error',
  //         title: 'Terjadi kesalahan!',
  //         text: content
  //       });
  // }

  // toastSuccess(content) {
  //     const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 3000,
  //         timerProgressBar: true,
  //         didOpen: (toast) => {
  //           toast.addEventListener('mouseenter', Swal.stopTimer);
  //           toast.addEventListener('mouseleave', Swal.resumeTimer);
  //         }
  //       });

  //     Toast.fire({
  //         icon: 'success',
  //         title: 'Berhasil!',
  //         text: content
  //       });
  // }

  // toastWarning(content) {
  //     const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 3000,
  //         timerProgressBar: true,
  //         didOpen: (toast) => {
  //           toast.addEventListener('mouseenter', Swal.stopTimer);
  //           toast.addEventListener('mouseleave', Swal.resumeTimer);
  //         }
  //       });

  //     Toast.fire({
  //         icon: 'warning',
  //         title: 'Perhatian!',
  //         text: content
  //       });
  // }

  // toastInfo(content) {
  //     const Toast = Swal.mixin({
  //         toast: true,
  //         position: 'top-end',
  //         showConfirmButton: false,
  //         timer: 3000,
  //         timerProgressBar: true,
  //         didOpen: (toast) => {
  //           toast.addEventListener('mouseenter', Swal.stopTimer);
  //           toast.addEventListener('mouseleave', Swal.resumeTimer);
  //         }
  //       });

  //     Toast.fire({
  //         icon: 'info',
  //         title: 'Info!',
  //         text: content
  //       });
  // }
}
