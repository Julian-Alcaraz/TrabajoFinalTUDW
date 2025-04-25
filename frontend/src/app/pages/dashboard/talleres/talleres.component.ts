import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import { TallerService } from '@app/services/taller.service';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';

@Component({
  selector: 'app-talleres',
  standalone: true,
  imports: [YearGradoFormComponent, BarGraphComponent],
  templateUrl: './talleres.component.html',
  styleUrl: './talleres.component.css',
})
export class TalleresComponent implements OnInit {
  public con = Constantes;

  public loading = true;
  public porcentaje = 0;
  public year = 0;
  public id_curso = 0;
  public subTitulo = '';
  public cursoLabel = '';
  public lastFourYears: number[];
  public currentYear: number;

  public cantEncuentrosxMarcoPrevencion: any = [];
  public cantEncuentrosxMarcoFonoaudiologia: any = [];
  public cantEncuentrosxMarcoNutricion: any = [];
  public cantEncuentrosxMarcoOdontologia: any = [];
  public cantEncuentrosxMarcoClinica: any = [];
  public dataCantEncuentrosxMarco: any = [];
  public dataParticipantesTalleresxAnio: any = [];
  public dataTalleresxAnioxEspecialidad: any = [];
  public dataTalleresxAnio: any = [];

  constructor(
    private snackBar: MatSnackBar,
    private _tallerService: TallerService,
  ) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }

  ngOnInit() {
    this.obtenerGraficos();
  }
  async obtenerGraficos() {
    const promesas = [
      this.countTypeTalleresxanio(),
      this.countTalleresxAnio(),
      this.countParticipantesxAnio(),
      this.countCantEncuentrosxMarco(),
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

  countTypeTalleresxanio() {
    return new Promise((resolve, reject) => {
      this._tallerService.countTypeByYear(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          this.dataTalleresxAnioxEspecialidad = [];
          if (response.success) {
            this.dataTalleresxAnioxEspecialidad = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }

  countTalleresxAnio() {
    return new Promise((resolve, reject) => {
      this._tallerService.countTallerLastYears(this.currentYear).subscribe({
        next: (response: any) => {
          this.dataTalleresxAnio = [];
          if (response.success) {
            this.dataTalleresxAnio.push({
              label: 'Talleres',
              data: response.data,
            });
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }
  countParticipantesxAnio() {
    return new Promise((resolve, reject) => {
      this._tallerService.countParticipantesxYear(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          this.dataParticipantesTalleresxAnio = [];
          if (response.success) {
            this.dataParticipantesTalleresxAnio = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }

  countCantEncuentrosxMarco() {
    this.cantEncuentrosxMarcoClinica = [];
    this.cantEncuentrosxMarcoPrevencion = [];
    this.cantEncuentrosxMarcoFonoaudiologia = [];
    this.cantEncuentrosxMarcoNutricion = [];
    this.cantEncuentrosxMarcoOdontologia = [];

    return new Promise((resolve, reject) => {
      this._tallerService.countCantEncuentrosxMarco(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.cantEncuentrosxMarcoClinica = response.data.clinica;
            this.cantEncuentrosxMarcoPrevencion = response.data.prevencion;
            this.cantEncuentrosxMarcoFonoaudiologia = response.data.fonoaudiologia;
            this.cantEncuentrosxMarcoNutricion = response.data.nutricion;
            this.cantEncuentrosxMarcoOdontologia = response.data.odontologia;
          }
          resolve(true);
        },
        error: (err: any) => {
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
