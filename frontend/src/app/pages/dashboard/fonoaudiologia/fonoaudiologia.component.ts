import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ConsultaService } from '@services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';
import { GridChangerComponent } from '../components/grid-changer/grid-changer.component';
import { CommonModule } from '@angular/common';
import * as con from '../../../common/const/const';

@Component({
  selector: 'app-fonoaudiologia',
  standalone: true,
  imports: [YearGradoFormComponent, BarGraphComponent, PieGraphComponent, GridChangerComponent, CommonModule],
  templateUrl: './fonoaudiologia.component.html',
})
export class FonoaudiologiaComponent implements OnInit {
  @ViewChildren(BarGraphComponent) barGraphs!: QueryList<BarGraphComponent>;
  @ViewChildren(PieGraphComponent) pieGraphs!: QueryList<PieGraphComponent>;
  loading = true;
  grid = 3;
  year = 0;
  id_curso = 0;
  porcentaje = 0;
  subTitulo = '';
  cursoLabel = '';
  currentYear: number;
  lastFourYears: number[];
  tituloCausas = 'Causas';
  tituloDiagnosticoPresuntivo = 'Diagnostico Presuntivo';
  porcentajeCausas: any = [];
  porcentajeDiagnosticoPresuntivo: any = [];
  countCausas = [];
  countDiagnosticoPresuntivo = [];
  labelCausas = con.CausasEnum;
  // labelCausas = ['Prenatal', 'Postnatal', 'ACV', 'Respiratorias', 'Audición', 'Patologías clínicas', 'Síndromes', 'Inflamación de amígdalas o adenoides', 'Prematurez', 'Otras'];
  labelDiagnosticoPresuntivo = con.DiagnosticoPresuntivoEnum;
  // labelDiagnosticoPresuntivo = ['TEL', 'TEA', 'Retraso en el lenguaje, dislalias funcionales', 'Respirador bucal', 'Anquiloglosia', 'Ortodoncia: Protrusión lingual, paladar hendido', 'Síndromes', 'Otras patologías que dificulten el lenguaje y la comunicación'];
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
    const promesas = [this.obtenerGraficosPorcentajesCausas(), this.obtenerGraficosPorcentajesDiagnosticoPresuntivo(), this.obtenerGraficosCausas(), this.obtenerGraficosDiagnosticoPresuntivo()];
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

  obtenerGraficosPorcentajesCausas() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeCausasPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeCausas = [];
            for (const year of this.lastFourYears) {
              this.porcentajeCausas.push({
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
  obtenerGraficosPorcentajesDiagnosticoPresuntivo() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeDiagnosticoPresuntivoPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeDiagnosticoPresuntivo = [];
            for (const year of this.lastFourYears) {
              this.porcentajeDiagnosticoPresuntivo.push({
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
  obtenerGraficosCausas() {
    return new Promise((resolve, reject) => {
      this._consultaService.countCausasByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.countCausas = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficosDiagnosticoPresuntivo() {
    return new Promise((resolve, reject) => {
      this._consultaService.countDaignosticoPresuntivoByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.countDiagnosticoPresuntivo = response.data;
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
