import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import { TallerService } from '@app/services/taller.service';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { EspecialidadService } from '@app/services/especialidad.service';
import { Especialidad } from '@app/models/especialidad.model';
import { MarcoService } from '@app/services/marco.service';
import { Marco } from '@app/models/marco.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';
import { GridChangerComponent } from '../components/grid-changer/grid-changer.component';
import { ExpandCompressButtonComponent } from '../components/expand-compress-button/expand-compress-button.component';

@Component({
  selector: 'app-talleres',
  standalone: true,
  imports: [CommonModule, YearGradoFormComponent, BarGraphComponent, LoadingComponent, PieGraphComponent, GridChangerComponent, ExpandCompressButtonComponent],
  templateUrl: './talleres.component.html',
})
export class TalleresComponent implements OnInit {
  @ViewChildren(BarGraphComponent) barGraphs!: QueryList<BarGraphComponent>;
  @ViewChildren(PieGraphComponent) pieGraphs!: QueryList<PieGraphComponent>;
  public con = Constantes;
  public grid = 3;
  public searchingMarcos = true;
  public searchingEspecialidades = true;
  public loading = true;

  public porcentaje = 0;
  public year = 0;
  public id_curso = 0;
  public id_institucion = 0;
  public subTitulo = '';
  public cursoLabel = '';
  public institucionLabel = '';
  public cursoInstitucionLabel = '';
  public lastFourYears: number[];
  public currentYear: number;
  public participantes = 0;
  public participantesOEncuentros = 'Encuentros';
  public especialidades: Especialidad[] = [];
  public marcos: Record<string, string[]> = {};

  public dataCantEncuentrosxMarco: any = [];
  public dataParticipantesTalleresxAnio: any = [];
  public dataTalleresxAnioxEspecialidad: any = [];
  public dataTalleresxAnio: any = [];
  public dataTipoTaller: any = [];

  constructor(
    private snackBar: MatSnackBar,
    private _tallerService: TallerService,
    private _especialidadService: EspecialidadService,
    private _marcoService: MarcoService,
  ) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }

  ngOnInit() {
    this.obtenerGraficos();
    this.obtenerEspecialidades();
    this.obtenerMarcos();
  }

  actualizarGraficos() {
    if (!this.barGraphs || !this.pieGraphs) return;
    this.barGraphs.forEach((graph) => {
      graph.actualizarSets(); // Llama al método del hijo
    });
    this.pieGraphs.forEach((graph) => {
      graph.actualizarSets(); // Llama al método del hijo
    });
  }

  setearGrid(event: any) {
    this.grid = event;
  }

  async obtenerGraficos() {
    const promesas = [
      //
      this.countTypeTalleresxanio(),
      this.countTalleresxAnio(),
      this.countParticipantesxEspecialidad(),
      this.countCantEncuentrosxMarco(),
      this.countCantTalleresxTipo(),
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

  obtenerEspecialidades() {
    this.searchingEspecialidades = true;
    this._especialidadService.obtenerEspecialidades().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.especialidades = response.data;
        }
        this.searchingEspecialidades = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerMarcos() {
    this.searchingMarcos = true;
    this._marcoService.obtenerMarcos().subscribe({
      next: (response: any) => {
        this.marcos = response.data.reduce((acc: Record<string, string[]>, marco: Marco) => {
          const especialidad: string = marco.especialidad!.nombre.toLowerCase();
          if (!acc[especialidad]) {
            acc[especialidad] = [];
          }
          acc[especialidad].push(marco.nombre);
          return acc;
        }, {});
        this.searchingMarcos = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  countTypeTalleresxanio() {
    return new Promise((resolve, reject) => {
      this._tallerService.countTypeByYear(this.currentYear, this.id_curso, this.id_institucion, this.porcentaje).subscribe({
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
      this._tallerService.countTallerLastYears(this.currentYear, this.id_curso, this.id_institucion).subscribe({
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

  countParticipantesxEspecialidad() {
    return new Promise((resolve, reject) => {
      this._tallerService.countParticipantesxEspecialidad(this.currentYear, this.id_curso, this.id_institucion, this.porcentaje, this.participantes).subscribe({
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
    return new Promise((resolve, reject) => {
      this._tallerService.countCantEncuentrosxMarco(this.currentYear, this.id_curso, this.id_institucion, this.porcentaje, this.participantes).subscribe({
        next: (response: any) => {
          this.dataCantEncuentrosxMarco = [];
          if (response.success) {
            this.dataCantEncuentrosxMarco = response.data;
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }

  countCantTalleresxTipo() {
    return new Promise((resolve, reject) => {
      this._tallerService.countCantTalleresxTipo(this.year, this.id_curso, this.id_institucion).subscribe({
        next: (response: any) => {
          this.dataTipoTaller = [];
          if (response.success) {
            this.dataTipoTaller = { label: '', data: response.data };
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
    let institucionLabel;
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
    if (event.id_institucion) {
      this.id_institucion = event.id_institucion;
      institucionLabel = ' ' + event.nombreInstitucion;
    } else {
      this.id_institucion = 0;
      institucionLabel = '';
    }
    this.subTitulo = [yearLabel, cursoLabel, institucionLabel].filter(Boolean).join(', ');
    this.cursoLabel = cursoLabel;
    this.institucionLabel = institucionLabel;
    this.cursoInstitucionLabel = [institucionLabel, cursoLabel].filter(Boolean).join(', ');
  }

  getMarcos(especialidad: string): string[] {
    return this.marcos[especialidad] || [];
  }
}
