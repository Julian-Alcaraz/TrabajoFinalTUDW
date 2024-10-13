import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

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
    return this._http.get(this.url + 'localidad/barrios/' + id);
  }
}
