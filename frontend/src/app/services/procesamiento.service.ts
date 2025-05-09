import { HttpClient, HttpResponse } from '@angular/common/http';
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

  // ============ IMPORTS ============

  procesarClinica(formData: FormData): Observable<any> {
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

  procesarPrevencion(formData: FormData): Observable<any> {
    return this._http.post(this.url + 'procesamiento/prevencion', formData);
  }

  procesarSocial(formData: FormData): Observable<any> {
    return this._http.post(this.url + 'procesamiento/social', formData);
  }

  // ============ EXPORTS ============

  exportarConsultas(filtros: any): Observable<HttpResponse<any>> {
    return this._http.post(this.url + 'procesamiento/export/consultas', filtros, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  exportarChicos(filtros: any): Observable<HttpResponse<any>> {
    return this._http.post(this.url + 'procesamiento/export/chicos', filtros, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
