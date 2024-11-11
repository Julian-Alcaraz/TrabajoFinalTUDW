import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  private url: string;
  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  busquedaPersonalizada(data: any): Observable<any> {
    return this._http.post(this.url + 'consulta/busquedaPersonalizada', data);
  }

  // Obtiene todas las consultas y sus relaciones con chico, curso e institucion
  obtenerConsultas(): Observable<any> {
    return this._http.get(this.url + 'consulta/');
  }
  obtenerConsultasxAnio(anio:number): Observable<any> {
    return this._http.get(this.url + 'consulta/year/'+anio);
  }
  cargarConsulta(data: any): Observable<any> {
    return this._http.post(this.url + 'consulta', data);
  }
  modficarConsulta(id:number,data: any): Observable<any> {
    return this._http.patch(this.url + 'consulta/'+id ,data);
  }
  obtenerConsultaxId(id: number): Observable<any> {
    return this._http.get(this.url + 'consulta/' + id);
  }

  esPrimeraVez(id: number, tipoConsulta: string) {
    return this._http.get(this.url + 'consulta/primeraVezChico/' + id + '/' + tipoConsulta);
  }
}
