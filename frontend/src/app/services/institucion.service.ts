import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InstitucionService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  modificarInstitucion(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'institucion/' + id, data);
  }
  obtenerInstituciones() {
    return this._http.get(this.url + 'institucion/habilitadas');
  }
  // Obtiene las deshabilitadas tambien
  obtenerTodasInstituciones() {
    return this._http.get(this.url + 'institucion');
  }
  cargarInstitucion(data: any): Observable<any> {
    return this._http.post(this.url + 'institucion', data);
  }
}
