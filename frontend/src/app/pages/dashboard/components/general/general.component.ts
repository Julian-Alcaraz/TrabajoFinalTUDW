import { Component, OnInit } from '@angular/core';
import { BarGraphComponent } from '../graphs/bar-graph.component';
import { ConsultaService } from '../../../../services/consulta.service';
import { ChicoService } from '../../../../services/chico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { PieGraphComponent } from '../graphs/pie-graph.component';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { InstitucionService } from '../../../../services/institucion.service';
import { Institucion } from '../../../../models/institucion.model';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, DatePickerModule, BarGraphComponent, PieGraphComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent implements OnInit {
  currentYear: number;
  lastFourYears: number[];
  loading = true;
  subTituloYear = '';
  subTituloInstitucion = '';
  maxDate: any;

  instituciones: Institucion[] = [];
  selectedYear = 0;
  selectedId_institucion = 0;
  dataTypeYearAndInstitucion: any = [];

  dataChicosxAnio: any = [];
  dataConsultaxAnio: any = [];
  dataTipoConsultaxanio: any = [];

  constructor(
    private _consultaService: ConsultaService,
    private _chicoService: ChicoService,
    private snackBar: MatSnackBar,
    private _institucionService: InstitucionService,
  ) {
    this.maxDate = new Date();
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }

  ngOnInit(): void {
    this.obtenerGraficos();
    this.obtenerInstituciones();
  }
  async obtenerGraficos() {
    const promesas = [this.countChicosCargados(), this.countConsultasxanio(), this.countTypeConsultaxanio(), this.obtenerGraficoByYearAndInstitucion()];
    Promise.all(promesas).then(() => (this.loading = false));
    try {
      await Promise.all(promesas);
      MostrarNotificacion.mensajeExito(this.snackBar, 'Datos encontrados exitosamente.');
    } catch (error) {
      MostrarNotificacion.mensajeErrorServicio(this.snackBar, error);
    } finally {
      this.loading = false;
    }
  }
  countChicosCargados() {
    return new Promise((resolve, reject) => {
      this._chicoService.countChicosCargadosxAnios(this.currentYear).subscribe({
        next: (response: any) => {
          this.dataChicosxAnio = [];
          if (response.success) {
            this.dataChicosxAnio.push({
              label: 'Chicos',
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

  countConsultasxanio() {
    return new Promise((resolve, reject) => {
      this._consultaService.countConsultaLastYears(this.currentYear).subscribe({
        next: (response: any) => {
          this.dataConsultaxAnio = [];
          if (response.success) {
            this.dataConsultaxAnio.push({
              label: 'Consultas',
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

  countTypeConsultaxanio() {
    return new Promise((resolve, reject) => {
      this._consultaService.countTypeConsultaLastYears(this.currentYear).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.dataTipoConsultaxanio = [];
            for (const year of this.lastFourYears) {
              this.dataTipoConsultaxanio.push({
                label: '' + year,
                data: response.data[year],
              });
            }
          }
          resolve(true);
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }

  obtenerGraficoByYearAndInstitucion() {
    return new Promise((resolve, reject) => {
      this._consultaService.countTypeConsultaByYearAndInstitucion(this.selectedYear, this.selectedId_institucion).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.dataTypeYearAndInstitucion = response.data;
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  seleccionarYear(event: any) {
    console.log(event);

    this.selectedYear = event ? +event.getFullYear() : 0;
    if (this.selectedYear === 0) {
      this.subTituloYear = '';
    } else {
      this.subTituloYear = '(' + this.selectedYear + ')';
    }
    this.obtenerGraficoByYearAndInstitucion();
  }
  seleccionarInstituciones(event: any) {
    this.selectedId_institucion = +event.target.value;
    if (this.selectedId_institucion === 0) {
      this.subTituloInstitucion = '';
    } else {
      const institucionSelected = this.instituciones.filter((inst) => this.selectedId_institucion === inst.id);
      this.subTituloInstitucion = ' ' + institucionSelected[0].nombre;
    }
    this.obtenerGraficoByYearAndInstitucion();
  }
  obtenerInstituciones() {
    this._institucionService.obtenerTodasInstituciones().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.instituciones = response.data;
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }
}
