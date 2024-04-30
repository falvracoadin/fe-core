import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VenturoService } from 'src/app/core/service/venturo.service';

@Injectable({
  providedIn: 'root'
})
export class OidcService {

  constructor(
    private http : VenturoService,
  ) { }


  processOidc(code : string, redirect : string){
    return this.http.DataPost("/oidc/process", {
      "Code" : code,
      "RedirectUrl" : redirect,
    }, true, false)
  }

  refreshToken(){ 
    if(localStorage.getItem("refreshToken")){
      return this.http.DataPost("/oidc/refresh", {
        RefreshToken : localStorage.getItem("refreshToken")
      })
    }else {
      return null
    }
  }
}