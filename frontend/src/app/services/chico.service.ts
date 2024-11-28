import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../config/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChicoService {
  private url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  obtenerChicoxDni(dni: number): Observable<any> {
    return this._http.get(this.url + 'chico/dni/' + dni);
  }

  obtenerConsultasDeChico(id: number): Observable<any> {
    return this._http.get(this.url + 'chico/' + id + '/consultas');
  }

  obtenerChicoxId(id: number): Observable<any> {
    return this._http.get(this.url + 'chico/' + id);
  }

  cargarChico(data: any): Observable<any> {
    return this._http.post(this.url + 'chico', data);
  }

  obtenerChicos(): Observable<any> {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    return this._http.get(this.url + 'chico/activity/'+anio);
  }

  modificarChico(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'chico/' + id, data);
  }

  countChicosCargadosxAnios(year:number): Observable<any> {
    return this._http.get(this.url + 'chico/cargadosxanios/'+year);
  }
}
