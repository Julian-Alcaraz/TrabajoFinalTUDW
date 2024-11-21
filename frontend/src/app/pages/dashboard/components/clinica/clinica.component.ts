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
  subTitulo = '';
  tensionArterial = [];
  estadoNutriconal = [];
  tensionXestado = [];
  year = 0;
  id_curso = 0;
  selectedEstadoNutricional = this.estadosNutricional[4];
  lastFourYears:number[]
  currentYear:number
  porcentajeEstadoNutricional :any=[];
  porcentajesTensionArterial :any=[];
  cursoLabel=''
  constructor(private _consultaService: ConsultaService) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [ this.currentYear - 3, this.currentYear - 2, this.currentYear -1,this.currentYear];
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
          this.porcentajesTensionArterial=[]
          for (const year of this.lastFourYears) {
            this.porcentajesTensionArterial.push({
              label: ''+year,
              data:response.data[year]
            })
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
        console.log(response)
        if (response.success) {
          this.porcentajeEstadoNutricional=[]
          for (const year of this.lastFourYears) {
            this.porcentajeEstadoNutricional.push({
              label: ''+year,
              data:response.data[year]
            })
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
    this.cursoLabel= cursoLabel
  }
}
