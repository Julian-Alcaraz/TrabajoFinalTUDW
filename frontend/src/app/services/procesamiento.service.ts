import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@app/config/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcesamientoService {
  private url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  procesarClinica(formData: FormData, ): Observable<any> {
    return this._http.post(this.url + 'procesamiento/clinica', formData);
  }

  procesarOftalmologia(formData: FormData): Observable<any> {
    return this._http.post(this.url + 'procesamiento/oftalmologia', formData);
  }

  procesarOdontologia(formData: FormData): Observable<any> {
    return this._http.post(this.url + 'procesamiento/odontologia', formData);
  }
  
  procesarFonoaudiologia(formData: FormData): Observable<any> {
    return this._http.post(this.url + 'procesamiento/fonoaudiologia', formData);
  }
}
