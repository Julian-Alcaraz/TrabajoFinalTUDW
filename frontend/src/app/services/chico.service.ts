import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
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

  obtenerChicoxId(id: number): Observable<any> {
    return this._http.get(this.url + 'chico/' + id);
  }

  cargarChico(data: any): Observable<any> {
    return this._http.post(this.url + 'chico', data);
  }

  obtenerChicos(): Observable<any> {
    return this._http.get(this.url + 'chico');
  }

  modificarChico(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'chico/' + id, data);
  }
}

