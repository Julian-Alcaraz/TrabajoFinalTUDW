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

  // Obtiene todas las consultas y sus relaciones con chico, curso e institucion
  obtenerConsultas(): Observable<any> {
    return this._http.get(this.url + 'consulta/');
  }

  cargarConsulta(data: any): Observable<any> {
    return this._http.post(this.url + 'consulta', data);
  }

  obtenerConsultaxId(id: number): Observable<any> {
    return this._http.get(this.url + 'consulta/' + id);
  }

  esPrimeraVez(id: number, tipoConsulta: string) {
    return this._http.get(this.url + 'consulta/primeraVezChico/' + id + '/' + tipoConsulta);
  }
}
