import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../config/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LocalidadService {
  private url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  modificarLocalidad(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'localidad/' + id, data);
  }
  obtenerLocalidades() {
    return this._http.get(this.url + 'localidad/habilitadas');
  }
  // Obtiene las deshabilitadas tambien
  obtenerTodasLocalidades() {
    return this._http.get(this.url + 'localidad');
  }
  obtenerBarriosXLocalidad(id: string) {
    return this._http.get(this.url + `localidad/${id}/barrios`);
  }
  cargarLocalidad(data: any): Observable<any> {
    return this._http.post(this.url + 'localidad', data);
  }
}
