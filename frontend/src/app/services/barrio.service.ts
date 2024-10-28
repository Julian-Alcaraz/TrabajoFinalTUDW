import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarrioService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  cargarBarrio(data: any): Observable<any> {
    return this._http.post(this.url + 'barrio', data);
  }


  /*
  obtenerBarriosXLocalidad(idLocalidad: string) {
    return this._http.get(this.url + 'barrio/localidad/'+idLocalidad);
    //return this._http.get(this.url + 'barrio');
  }
  */
}
