import { Component, OnInit } from '@angular/core';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { ConsultaService } from '@app/services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridChangerComponent } from '../components/grid-changer/grid-changer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [YearGradoFormComponent, GridChangerComponent, CommonModule],
  templateUrl: './social.component.html',
})
export class SocialComponent implements OnInit {
  loading = true;
  grid = 3;
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
    this.obtenerGraficos();
  }
  async obtenerGraficos() {
    const promesas = [
      // agrego todos los graficos que correspondan
      this.obtenerGraficosDemanda(), //grafico de porcentajes
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
