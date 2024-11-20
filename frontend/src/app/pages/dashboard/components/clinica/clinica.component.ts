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
  tituloTensionArterial = 'Tension Arterial';
  tituloEstadoNutriconal = 'Estado Nutricional';
  tensionArterial = [];
  estadoNutriconal = [];
  year = 0;
  id_curso = 0;

  constructor(private _consultaService: ConsultaService) {}

  ngOnInit() {
    this.obtenerGraficos();
  }
  obtenerGraficos() {
    this.obtenerGraficoTensionArterial();
    this.obtenerGraficoEstadoNutricional();
  }
  obtenerGraficoTensionArterial() {
    // aca tengo que pasar los valores del form
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
    // aca tengo que pasar los valores del form
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
      cursoLabel= ' '+event.nombreCurso
    } else {
      this.id_curso = 0;
      cursoLabel = '';
    }
    this.tituloTensionArterial = 'Tension Arterial' + yearLabel + cursoLabel;
    this.tituloEstadoNutriconal = 'Estado Nutricional' + yearLabel + cursoLabel;
  }
}
