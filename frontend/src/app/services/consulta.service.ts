import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '@config/global';
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

  obtenerTotalPersonalizada(data: any): Observable<any> {
    return this._http.post(this.url + 'consulta/countBusquedaPersonalizada', data);
  }

  busquedaPersonalizadaLimited(data: any, page: number, size: number): Observable<any> {
    return this._http.post(this.url + 'consulta/busquedaPersonalizada/limited/' + page + '/' + size, data);
  }
  // Obtiene todas las consultas y sus relaciones con chico, curso e institucion
  obtenerConsultas(): Observable<any> {
    return this._http.get(this.url + 'consulta/');
  }

  obtenerConsultasxAnio(anio: number): Observable<any> {
    return this._http.get(this.url + 'consulta/year/' + anio);
  }
  obtenerTotalxAnio(anio: number) {
    return this._http.get(this.url + `consulta/countTotalYear/${anio}`);
  }

  obtenerConsultasxAnioLimited(anio: number, page: number, size: number): Observable<any> {
    return this._http.get(this.url + `consulta/year/${anio}/limited/${page}/${size}`);
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
  borrarLogico(id: number): Observable<any> {
    return this._http.delete(this.url + 'consulta/' + id);
  }
  esPrimeraVez(id: number, tipoConsulta: string) {
    return this._http.get(this.url + 'consulta/primeraVezChico/' + id + '/' + tipoConsulta);
  }

  // ============================ Graficos ============================
  countConsultaLastYears(year: number) {
    return this._http.get(this.url + 'consulta/contarXanios/' + year);
  }

  countTypeConsultaLastYears(year: number) {
    return this._http.get(this.url + 'consulta/contarTipoXanios/' + year);
  }

  countTypeConsultaByYearAndInstitucion(year: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/contarTipoXanios/${year}/institucion/${id_institucion}`);
  }
  // clinica
  countTensionArterialByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/tensionArterialPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }

  countEstadoNutricionalByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/estadoNutricionalPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }

  countTensionxEstadoByYearAndCurso(year: number, id_curso: number, id_institucion: number, estadoNutricional: string) {
    return this._http.post(`${this.url}consulta/tensionxEstadoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`, { estado: estadoNutricional });
  }

  porcentajeTensionArterialByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeTensionArterialPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }

  porcentajeEstadoNutricionalByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeEstadoNutricionalPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeExamenVisualByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeExamenVisualPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeVacunacionByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeVacunacionPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeOrtopediaPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeOrtopediaPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeLenguajePorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeLenguajePorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  // odontologia
  porcentajeCepilladoPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeCepilladoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeTopificacionPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeTopificacionPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeSituacionBucalPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeSituacionBucalPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeSelladorPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeSelladoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  countCepilladoPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/countCepilladoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  countTopificacionPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/countTopificacionPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  countSituacionBucalPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/countSituacionBucalPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  countSelladorPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/countSelladoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }

  // Ofatlmologia
  porcentajeAnteojosPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeAnteojosPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeDemandaPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeDemandaPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  countAnteojosByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/countAnteojosPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  countDemandaByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/countDemandaPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }

  // Prevencion
  countProblematicaByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/problematicaPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  countFrecuenciaConsumoByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/frecuenciaPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  countMotivoConsumoByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/motivoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  countDrogasHabitualesByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/drogaHabitualPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }

  porcentajeProblematicaByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeProblematicaPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeDrogasHabitualesPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeDrogasHabitualesPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeMotivoaConsumoPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeMotivoConsumoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  porcentajeFrecuenciaConsumoPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeFrecuenciaConsumoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  // Fonouadiologia
  countCausasByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/causasPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  porcentajeCausasPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeCausasPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  countDaignosticoPresuntivoByYearAndCurso(year: number, id_curso: number, id_institucion: number) {
    return this._http.get(`${this.url}consulta/diagnosticoPresuntivoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}`);
  }
  porcentajeDiagnosticoPresuntivoPorAnioByYearAndCurso(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/porcentajeDiagnosticoPresuntivoPorAnio/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
  // Social
  countConsultasByCategoria(year: number, id_curso: number, id_institucion: number, porcentaje: number) {
    return this._http.get(`${this.url}consulta/countConsultasByCategoria/${year}/curso/${id_curso}/institucion/${id_institucion}/${porcentaje}`);
  }
}
