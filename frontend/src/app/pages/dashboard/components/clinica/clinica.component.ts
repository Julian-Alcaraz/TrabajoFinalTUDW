import { Component, OnInit } from '@angular/core';
import { PieGraphComponent } from '../graphs/pie-graph.component';
import { BarGraphComponent } from '../graphs/bar-graph.component';
import { CommonModule } from '@angular/common';
import { YearGradoFormComponent } from '../year-grado-form/year-grado-form.component';
import { ConsultaService } from '../../../../services/consulta.service';

@Component({
  selector: 'app-clinica',
  standalone: true,
  imports: [CommonModule, PieGraphComponent, BarGraphComponent, YearGradoFormComponent],
  templateUrl: './clinica.component.html',
  styleUrl: './clinica.component.css',
})
export class ClinicaComponent implements OnInit {
  estadosNutricional = ['B Bajo peso/Desnutrido', 'A Riesgo Nutricional', 'C Eutrófico', 'D Sobrepeso', 'E Obesidad'];
  tituloTensionArterial = 'Tensión Arterial';
  tituloEstadoNutriconal = 'Estado Nutricional';
  tituloTensionxEstado = 'Tensión por Estado Nutricional';
  tituloExamenVisual = 'Examen Visual';
  tituloVacunas = 'Vacunas';
  tituloOrtopedia = 'Ortopedia y traumatologia';
  tituloLenguaje = 'Lenguaje'
  subTitulo = '';
  tensionArterial = [];
  estadoNutriconal = [];
  tensionXestado = [];
  year = 0;
  id_curso = 0;
  selectedEstadoNutricional = this.estadosNutricional[2];
  lastFourYears: number[];
  currentYear: number;
  porcentajeEstadoNutricional: any = [];
  porcentajesTensionArterial: any = [];
  porcentajesExamenVisual: any = [];
  porcentajesVacunas: any = [];
  porcentajesOrtopedia: any = [];
  porcentajesLenguaje:any=[]

  cursoLabel = '';
  constructor(private _consultaService: ConsultaService) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }

  ngOnInit() {
    this.obtenerGraficos();
  }
  obtenerGraficos() {
    this.obtenerGraficoTensionArterial();
    this.obtenerGraficoEstadoNutricional();
    this.obtenerGraficoTensionxEstado();

    this.obtenerGraficoPorcentajeTensionArterial();
    this.obtenerGraficoPorcentajeEstadoNutricional();
    this.obtenerGraficoPorcentajeExamenVisual();
    this.obtenerGraficoPorcentajeVacunacion();
    this.obtenerGraficoPorcentajeOrtopedia();
    this.obtenerGraficoPorcentajeLenguaje();
  }
  obtenerGraficoTensionArterial() {
    this._consultaService.countTensionArterialByYearAndCurso(this.year, this.id_curso).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.tensionArterial = response.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  obtenerGraficoEstadoNutricional() {
    this._consultaService.countEstadoNutricionalByYearAndCurso(this.year, this.id_curso).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.estadoNutriconal = response.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  obtenerGraficoTensionxEstado() {
    this._consultaService.countTensionxEstadoByYearAndCurso(this.year, this.id_curso, this.selectedEstadoNutricional).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.tensionXestado = response.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obtenerGraficoPorcentajeTensionArterial() {
    this._consultaService.porcentajeTensionArterialByYearAndCurso(this.currentYear, this.id_curso).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obtenerGraficoPorcentajeEstadoNutricional() {
    this._consultaService.porcentajeEstadoNutricionalByYearAndCurso(this.currentYear, this.id_curso).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  obtenerGraficoPorcentajeExamenVisual() {
    this._consultaService.porcentajeExamenVisualByYearAndCurso(this.currentYear, this.id_curso).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obtenerGraficoPorcentajeVacunacion() {
    this._consultaService.porcentajeVacunacionByYearAndCurso(this.currentYear, this.id_curso).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obtenerGraficoPorcentajeOrtopedia() {
    this._consultaService.porcentajeOrtopediaPorAnioByYearAndCurso(this.currentYear, this.id_curso).subscribe({
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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obtenerGraficoPorcentajeLenguaje() {
    this._consultaService.porcentajeLenguajePorAnioByYearAndCurso(this.currentYear, this.id_curso).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success) {
          this.porcentajesLenguaje = [];
          for (const year of this.lastFourYears) {
            this.porcentajesLenguaje.push({
              label: '' + year,
              data: response.data[year],
            });
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
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
