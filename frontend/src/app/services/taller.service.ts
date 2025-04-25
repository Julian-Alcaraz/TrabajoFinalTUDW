import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TallerService {
  private url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.URL_BACKEND;
  }

  cargarTaller(data: any): Observable<any> {
    return this._http.post(this.url + 'taller', data);
  }

  obtenerTalleres(): Observable<any> {
    return this._http.get(this.url + 'taller/habilitados');
  }

  obtenerTodosTalleres(): Observable<any> {
    return this._http.get(this.url + 'taller');
  }

  obtenerTallerxId(id: number): Observable<any> {
    return this._http.get(this.url + 'taller/' + id);
  }

  modificarTaller(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'taller/' + id, data);
  }

  // ============================ Graficos ============================

  countTypeByYear(year: number, id_curso: number, porcentaje: number): Observable<any> {
    return this._http.get(`${this.url}taller/countTypeByYear/${year}/curso/${id_curso}/${porcentaje}`);
  }

  countTallerLastYears(year: number): Observable<any> {
    return this._http.get(`${this.url}taller/contarxAnios/${year}`);
  }

  countParticipantesxYear(year: number, id_curso: number, porcentaje: number): Observable<any> {
    return this._http.get(`${this.url}taller/countParticipantesxYear/${year}/curso/${id_curso}/${porcentaje}`);
  }

  countCantEncuentrosxMarco(year: number, id_curso: number, porcentaje: number): Observable<any> {
    return this._http.get(`${this.url}taller/countCantEncuentrosxMarco/${year}/curso/${id_curso}/${porcentaje}`);
  }
}
