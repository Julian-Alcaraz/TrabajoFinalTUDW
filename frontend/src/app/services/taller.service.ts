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

  countTypeByYear(year: number, id_curso: number, id_institucion: number, porcentaje: number): Observable<any> {
    return this._http.get(`${this.url}taller/countTypeByYear/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }

  countTallerLastYears(year: number, id_curso: number, id_institucion: number): Observable<any> {
    return this._http.get(`${this.url}taller/contarxAnios/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }

  countParticipantesxEspecialidad(year: number, id_curso: number, id_institucion: number, porcentaje: number, participantes: number): Observable<any> {
    return this._http.get(`${this.url}taller/countParticipantesxEspecialidad/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}/${participantes}`);
  }

  countCantEncuentrosxMarco(year: number, id_curso: number, id_institucion: number, porcentaje: number, participantes: number): Observable<any> {
    return this._http.get(`${this.url}taller/countCantEncuentrosxMarco/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}/${participantes}`);
  }

  countCantTalleresxTipo(year: number, id_curso: number, id_institucion: number): Observable<any> {
    return this._http.get(`${this.url}taller/countCantTalleresxTipo/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
}
