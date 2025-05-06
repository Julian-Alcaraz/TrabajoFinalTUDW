import { Component, OnInit } from '@angular/core';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import { ConsultaService } from '@app/services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';

@Component({
  selector: 'app-prevencion',
  standalone: true,
  imports: [YearGradoFormComponent, BarGraphComponent, PieGraphComponent],
  templateUrl: './prevencion.component.html',
})
export class PrevencionComponent implements OnInit {
  loading = true;
  year = 0;
  id_curso = 0;
  porcentaje = 0;
  subTitulo = '';
  cursoLabel = '';
  currentYear: number;
  lastFourYears: number[];

  tituloProblematica = 'Problematica';
  tituloMotivoConsumo = 'Motivo Consumo';
  tituloFrecuenciaCosumo = 'Frecuencia Consumo';
  tituloDrogaHabitual = 'Droga Habitual';
  problematica = ['Consumo problematico', 'Bajo rendimiento', 'Violencia familiar', 'Depresion', 'Bullying', 'Otra'];
  motivoConsumo = ['Curiosidad', 'Presion de grupo', 'Ritos Familiar', 'Otro'];
  frecuenciaConsumo = ['Todos los dias', '2 veces por semana', '3 veces por semana', 'Fines de semana', 'Exporadico', 'Otro'];
  drogaHabitual = ['Alchol', 'Marihuana', 'Cocaina', 'Tabaco', 'Otra'];
  countProblematica = [];
  countMotivoConsumo = [];
  countFrecuenciaCosumo = [];
  countDrogaHabitual = [];
  porcentajeProblematica: any = [];
  porcentajeMotivoConsumo: any = [];
  porcentajeFrecuenciaCosumo: any = [];
  porcentajeDrogaHabitual: any = [];
  constructor(
    private _consultaService: ConsultaService,
    private snackBar: MatSnackBar,
  ) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }

  ngOnInit() {
    this.obtenerGraficos();
  }

  async obtenerGraficos() {
    const promesas = [
      this.obtenerGraficosCountProblematica(),
      this.obtenerGraficosCountFrecuenciaConsumo(),
      this.obtenerGraficosCountMotivoConsumo(),
      this.obtenerGraficosCountDrogasHabituales(),
      // agrego todos los graficos que correspondan
      this.obtenerGraficosProblematica(),
      this.obtenerGraficosFrecuenciaConsumo(), //grafico de porcentajes
      this.obtenerGraficosMotivoConsumo(), //grafico de porcentajes
      this.obtenerGraficosDrogasHabituales(),
    ];
    Promise.all(promesas).then(() => (this.loading = false));
    try {
      await Promise.all(promesas);
    } catch (error) {
      MostrarNotificacion.mensajeErrorServicio(this.snackBar, error);
    } finally {
      this.loading = false;
    }
  }

  obtenerGraficosFrecuenciaConsumo() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeFrecuenciaConsumoPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeFrecuenciaCosumo = [];
            for (const year of this.lastFourYears) {
              this.porcentajeFrecuenciaCosumo.push({
                label: '' + year,
                data: response.data[year],
              });
            }
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  obtenerGraficosMotivoConsumo() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeMotivoaConsumoPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeMotivoConsumo = [];
            for (const year of this.lastFourYears) {
              this.porcentajeMotivoConsumo.push({
                label: '' + year,
                data: response.data[year],
              });
            }
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficosDrogasHabituales() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeDrogasHabitualesPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeDrogaHabitual = [];
            for (const year of this.lastFourYears) {
              this.porcentajeDrogaHabitual.push({
                label: '' + year,
                data: response.data[year],
              });
            }
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficosProblematica() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeProblematicaByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeProblematica = [];
            for (const year of this.lastFourYears) {
              this.porcentajeProblematica.push({
                label: '' + year,
                data: response.data[year],
              });
            }
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  obtenerGraficosCountProblematica() {
    return new Promise((resolve, reject) => {
      this._consultaService.countProblematicaByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.countProblematica = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficosCountFrecuenciaConsumo() {
    return new Promise((resolve, reject) => {
      this._consultaService.countFrecuenciaConsumoByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.countFrecuenciaCosumo = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficosCountMotivoConsumo() {
    return new Promise((resolve, reject) => {
      this._consultaService.countMotivoConsumoByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.countMotivoConsumo = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficosCountDrogasHabituales() {
    return new Promise((resolve, reject) => {
      this._consultaService.countDrogasHabitualesByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.countDrogaHabitual = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  cambioForm(event: any) {
    this.setearLabels(event);
    this.obtenerGraficos();
  }

  setearLabels(event: any) {
    if (event.porcentaje !== '') {
      this.porcentaje = +event.porcentaje;
    }
    let yearLabel;
    let cursoLabel;
    if (event.year) {
      this.year = event.year;
      yearLabel = ' (' + this.year + ')';
    } else {
      this.year = 0;
      yearLabel = '';
    }
    if (event.id_curso) {
      this.id_curso = event.id_curso;
      cursoLabel = ' ' + event.nombreCurso;
    } else {
      this.id_curso = 0;
      cursoLabel = '';
    }
    this.subTitulo = '' + yearLabel + cursoLabel;
    this.cursoLabel = cursoLabel;
  }
}
