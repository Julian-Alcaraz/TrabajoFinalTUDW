import { Component, OnInit } from '@angular/core';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { CommonModule } from '@angular/common';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import { ConsultaService } from '../../../services/consulta.service';
import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-clinica',
  standalone: true,
  imports: [CommonModule, PieGraphComponent, BarGraphComponent, YearGradoFormComponent],
  templateUrl: './clinica.component.html',
})
export class ClinicaComponent implements OnInit {
  loading = true;
  estadosNutricional = [ 'B Bajo peso/Desnutrido','A Riesgo Nutricional', 'C Eutrófico', 'D Sobrepeso', 'E Obesidad'];
  tituloTensionArterial = 'Tensión arterial';
  tituloEstadoNutricional = 'Estado nutricional';
  tituloTensionxEstado = 'Tensión por estado nutricional';
  tituloExamenVisual = 'Examen visual';
  tituloVacunas = 'Vacunas';
  tituloOrtopedia = 'Ortopedia y traumatologia';
  tituloLenguaje = 'Lenguaje';
  subTitulo = '';
  tensionArterial = [];
  estadoNutricional = [];
  tensionXestado = [];
  year = 0;
  id_curso = 0;
  porcentaje = 0;
  selectedEstadoNutricional = this.estadosNutricional[2];
  lastFourYears: number[];
  currentYear: number;
  porcentajeEstadoNutricional: any = [];
  porcentajesTensionArterial: any = [];
  porcentajesExamenVisual: any = [];
  porcentajesVacunas: any = [];
  porcentajesOrtopedia: any = [];
  porcentajesLenguaje: any = [];

  cursoLabel = '';
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
      this.obtenerGraficoTensionArterial(),
      this.obtenerGraficoEstadoNutricional(),
      this.obtenerGraficoTensionxEstado(),
      // Porcentajes
      this.obtenerGraficoPorcentajeTensionArterial(),
      this.obtenerGraficoPorcentajeEstadoNutricional(),
      this.obtenerGraficoPorcentajeExamenVisual(),
      this.obtenerGraficoPorcentajeVacunacion(),
      this.obtenerGraficoPorcentajeOrtopedia(),
      this.obtenerGraficoPorcentajeLenguaje(),
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
  obtenerGraficoTensionArterial() {
    return new Promise((resolve, reject) => {
      this._consultaService.countTensionArterialByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.tensionArterial = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  obtenerGraficoEstadoNutricional() {
    return new Promise((resolve, reject) => {
      this._consultaService.countEstadoNutricionalByYearAndCurso(this.year, this.id_curso).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.estadoNutricional = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  obtenerGraficoTensionxEstado() {
    return new Promise((resolve, reject) => {
      this._consultaService.countTensionxEstadoByYearAndCurso(this.year, this.id_curso, this.selectedEstadoNutricional).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.tensionXestado = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  obtenerGraficoPorcentajeTensionArterial() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeTensionArterialByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesTensionArterial = [];
            for (const year of this.lastFourYears) {
              this.porcentajesTensionArterial.push({
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

  obtenerGraficoPorcentajeEstadoNutricional() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeEstadoNutricionalByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajeEstadoNutricional = [];
            for (const year of this.lastFourYears) {
              this.porcentajeEstadoNutricional.push({
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

  obtenerGraficoPorcentajeExamenVisual() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeExamenVisualByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesExamenVisual = [];
            for (const year of this.lastFourYears) {
              this.porcentajesExamenVisual.push({
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

  obtenerGraficoPorcentajeVacunacion() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeVacunacionByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesVacunas = [];
            for (const year of this.lastFourYears) {
              this.porcentajesVacunas.push({
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

  obtenerGraficoPorcentajeOrtopedia() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeOrtopediaPorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesOrtopedia = [];
            for (const year of this.lastFourYears) {
              this.porcentajesOrtopedia.push({
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

  obtenerGraficoPorcentajeLenguaje() {
    return new Promise((resolve, reject) => {
      this._consultaService.porcentajeLenguajePorAnioByYearAndCurso(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.porcentajesLenguaje = [];
            for (const year of this.lastFourYears) {
              this.porcentajesLenguaje.push({
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

  seleccionarEstadoNutricional(event: any) {
    this.selectedEstadoNutricional = '' + event.target.value;
    this.obtenerGraficoTensionxEstado();
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
