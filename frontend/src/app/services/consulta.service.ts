import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../config/global';
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
  obtenerConsultasxAnio(anio: number): Observable<any> {
    return this._http.get(this.url + 'consulta/year/' + anio);
  }
  cargarConsulta(data: any): Observable<any> {
    return this._http.post(this.url + 'consulta', data);
  }
  modficarConsulta(id: number, data: any): Observable<any> {
    return this._http.patch(this.url + 'consulta/' + id, data);
  }
  obtenerConsultaxId(id: number): Observable<any> {
    return this._http.get(this.url + 'consulta/' + id);
  }

  esPrimeraVez(id: number, tipoConsulta: string) {
    return this._http.get(this.url + 'consulta/primeraVezChico/' + id + '/' + tipoConsulta);
  }
  // Graficos
  countConsultaLastYears(year: number) {
    return this._http.get(this.url + 'consulta/contarXanios/' + year);
  }

  countTypeConsultaLastYears(year: number) {
    return this._http.get(this.url + 'consulta/contarTipoXanios/' + year);
  }

  countTypeConsultaByYearAndInstitucion(year: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/contarTipoXanios/${year}/institucion/${id_institucion}`);
  }

  countTensionArterialByYearAndCurso(year: number, id_curso: number) {
    return this._http.get(`${this.url}consulta/tensionArterialPorAnio/${year}/curso/${id_curso}`);
  }

  countEstadoNutricionalByYearAndCurso(year: number, id_curso: number) {
    return this._http.get(`${this.url}consulta/estadoNutricionalPorAnio/${year}/curso/${id_curso}`);
  }

  countTensionxEstadoByYearAndCurso(year: number, id_curso: number, estadoNutricional: string) {
    return this._http.post(`${this.url}consulta/tensionxEstadoPorAnio/${year}/curso/${id_curso}`, { estado: estadoNutricional });
  }

  porcentajeTensionArterialByYearAndCurso(year: number, id_curso: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeTensionArterialPorAnio/${year}/curso/${id_curso}/${porcentaje}`);
  }

  porcentajeEstadoNutricionalByYearAndCurso(year: number, id_curso: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeEstadoNutricionalPorAnio/${year}/curso/${id_curso}/${porcentaje}`);
  }
  porcentajeExamenVisualByYearAndCurso(year: number, id_curso: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeExamenVisualPorAnio/${year}/curso/${id_curso}/${porcentaje}`);
  }
  porcentajeVacunacionByYearAndCurso(year: number, id_curso: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeVacunacionPorAnio/${year}/curso/${id_curso}/${porcentaje}`);
  }
  porcentajeOrtopediaPorAnioByYearAndCurso(year: number, id_curso: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeOrtopediaPorAnio/${year}/curso/${id_curso}/${porcentaje}`);
  }
  porcentajeLenguajePorAnioByYearAndCurso(year: number, id_curso: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeLenguajePorAnio/${year}/curso/${id_curso}/${porcentaje}`);
  }
}
