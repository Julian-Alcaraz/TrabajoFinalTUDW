import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class BarrioService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }
  
  /*
  obtenerBarriosXLocalidad(idLocalidad: string) {
    return this._http.get(this.url + 'barrio/localidad/'+idLocalidad);
    //return this._http.get(this.url + 'barrio');
  }
  */
}
