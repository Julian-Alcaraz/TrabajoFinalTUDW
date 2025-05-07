import { Component, OnInit } from '@angular/core';
import { ConsultaService } from '../../../services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';
import { DemandaEnum } from '../../../common/const/const';
@Component({
  selector: 'app-oftalmologia',
  standalone: true,
  imports: [YearGradoFormComponent, BarGraphComponent, PieGraphComponent],
  templateUrl: './oftalmologia.component.html',
})
export class OftalmologiaComponent implements OnInit {
  loading = true;
  year = 0;
  id_curso = 0;
  porcentaje = 0;
  subTitulo = '';
  cursoLabel = '';
  currentYear: number;
  lastFourYears: number[];
  tituloDemanda = 'Demanda';
  tituloAnteojos = 'Anteojos entregados';
  porcentajeDemanda: any = [];
  porcentajeAnteojos: any = [];
  arrayDemanda = DemandaEnum; // ['Control niño sano', 'Docente', 'Familiar', 'Otro'];
  countDemanda: any = [];
  countAnteojos: any = [];
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
    const promesas = [this.obtenerGraficosDemanda(), this.obtenerGraficosAnteojos(), this.graficoCountAnteojos(), this.graficoCountADemanda()];
    Promise.all(promesas).then(() => (this.loading = false));
    try {
      await Promise.all(promesas);
    } catch (error) {
      MostrarNotificacion.mensajeErrorServicio(this.snackBar, error);
    } finally {
      this.loading = false;
    }
  }

  graficoCountAnteojos() {
    return new Promise((resolve, reject) => {
      this._consultaService.countAnteojosByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          this.countAnteojos = [];
          if (response.success) {
            this.countAnteojos = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }

  graficoCountADemanda() {
    return new Promise((resolve, reject) => {
      this._consultaService.countDemandaByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          this.countDemanda = [];
          if (response.success) {
            this.countDemanda = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficosDemanda() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeDemandaPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeDemanda = [];
            for (const year of this.lastFourYears) {
              this.porcentajeDemanda.push({
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
  obtenerGraficosAnteojos() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeAnteojosPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeAnteojos = [];
            for (const year of this.lastFourYears) {
              this.porcentajeAnteojos.push({
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
