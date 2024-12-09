import { Component, OnInit } from '@angular/core';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { ConsultaService } from '../../../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
@Component({
  selector: 'app-odontologia',
  standalone: true,
  imports: [YearGradoFormComponent, BarGraphComponent],
  templateUrl: './odontologia.component.html',
})
export class OdontologiaComponent implements OnInit {
  loading = true;
  year = 0;
  id_curso = 0;
  porcentaje = 0;
  subTitulo = '';
  cursoLabel = '';
  currentYear: number;
  lastFourYears: number[];

  tituloCepillado = 'Cepillado';
  porcentajesCepillado: any = [];
  tituloTopificacion = 'Topificacion';
  porcentajesTopificacion: any = [];
  situacionBucales = ['Bajo índice de caries', 'Moderado índice de caries', 'Alto índice de caries', 'Boca sana', 'Sin clasificación'];
  tituloSituacionBucal = 'Situación bucal';
  porcentajesSituacionBucal: any = [];

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
      this.obtenerGraficoCepillado(),
      this.obtenerGraficoSitaucionBucal(),
      this.obtenerGraficoTopificacion(),
      this.obtenerGraficoSellador(),
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

  tituloSellador = 'Sellador';
  porcentajesSellador: any = [];
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
