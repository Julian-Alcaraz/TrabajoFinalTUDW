import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { ConsultaService } from '@services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';
import { CommonModule } from '@angular/common';
import { GridChangerComponent } from '../components/grid-changer/grid-changer.component';

@Component({
  selector: 'app-odontologia',
  standalone: true,
  imports: [YearGradoFormComponent, BarGraphComponent, PieGraphComponent, CommonModule, GridChangerComponent],
  templateUrl: './odontologia.component.html',
})
export class OdontologiaComponent implements OnInit {
  @ViewChildren(BarGraphComponent) barGraphs!: QueryList<BarGraphComponent>;
  @ViewChildren(PieGraphComponent) pieGraphs!: QueryList<PieGraphComponent>;
  loading = true;
  year = 0;
  grid = 3;
  id_curso = 0;
  porcentaje = 0;
  subTitulo = '';
  cursoLabel = '';
  currentYear: number;
  lastFourYears: number[];
  labelVeces = ['Ninguna', 'Una vez', 'Dos veces', 'Tres veces', ' Cuatro veces', 'Cinco veces'];
  tituloCepillado = 'Cantidad cepillado';
  porcentajesCepillado: any = [];
  tituloTopificacion = 'Topificacion';
  porcentajesTopificacion: any = [];
  situacionBucales = ['Bajo índice de caries', 'Moderado índice de caries', 'Alto índice de caries', 'Boca sana', 'Sin clasificación'];
  tituloSituacionBucal = 'Situación bucal';
  porcentajesSituacionBucal: any = [];
  tituloSellador = 'Sellador';
  porcentajesSellador: any = [];
  countCepillado: any = [];
  countSituacionBucal: any = [];
  countTopificacion: any = [];
  countSellador: any = [];
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
  setearGrid(event: any) {
    this.grid = event;
    this.barGraphs.forEach((graph) => {
      graph.actualizarSets(); // Llama al método del hijo
    });
    this.pieGraphs.forEach((graph) => {
      graph.actualizarSets(); // Llama al método del hijo
    });
  }
  async obtenerGraficos() {
    const promesas = [
      this.obtenerGraficoCepillado(),
      this.obtenerGraficoSitaucionBucal(),
      this.obtenerGraficoTopificacion(),
      this.obtenerGraficoSellador(),
      this.graficoCountCepillado(),
      this.graficoCountSellador(),
      this.graficoCountSituacionBucal(),
      this.graficoCountTopificacion(),
      //
    ];
    Promise.all(promesas).then(() => (this.loading = false));
    try {
      await Promise.all(promesas);
      // MostrarNotificacion.mensajeExito(this.snackBar, 'Datos encontrados exitosamente.');
    } catch (error) {
      MostrarNotificacion.mensajeErrorServicio(this.snackBar, error);
    } finally {
      this.loading = false;
    }
  }
  graficoCountCepillado() {
    return new Promise((resolve, reject) => {
      this._consultaService.countCepilladoPorAnioByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          this.countCepillado = [];
          if (response.success) {
            this.countCepillado = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }
  graficoCountSituacionBucal() {
    return new Promise((resolve, reject) => {
      this._consultaService.countSituacionBucalPorAnioByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          this.countSituacionBucal = [];
          if (response.success) {
            this.countSituacionBucal = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }
  graficoCountTopificacion() {
    return new Promise((resolve, reject) => {
      this._consultaService.countTopificacionPorAnioByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          this.countTopificacion = [];
          if (response.success) {
            this.countTopificacion = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }
  graficoCountSellador() {
    return new Promise((resolve, reject) => {
      this._consultaService.countSelladorPorAnioByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          this.countSellador = [];
          if (response.success) {
            this.countSellador = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficoCepillado() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeCepilladoPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesCepillado = [];
            for (const year of this.lastFourYears) {
              this.porcentajesCepillado.push({
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
  obtenerGraficoTopificacion() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeTopificacionPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesTopificacion = [];
            for (const year of this.lastFourYears) {
              this.porcentajesTopificacion.push({
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
  obtenerGraficoSitaucionBucal() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeSituacionBucalPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesSituacionBucal = [];
            for (const year of this.lastFourYears) {
              this.porcentajesSituacionBucal.push({
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

  obtenerGraficoSellador() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeSelladorPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesSellador = [];
            for (const year of this.lastFourYears) {
              this.porcentajesSellador.push({
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
