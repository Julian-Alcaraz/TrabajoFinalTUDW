import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  obtenerLocalidades() {
    return this._http.get(this.url + 'localidad');
  }

  obtenerBarriosXLocalidad(id: string) {
    return this._http.get(this.url + `localidad/${id}/barrios`);
  }

  cargarLocalidad(data: any): Observable<any> {
    return this._http.post(this.url + 'localidad', data);
  }
}
