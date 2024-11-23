import { Component, OnInit } from '@angular/core';
import { BarGraphComponent } from '../graphs/bar-graph.component';
import { ConsultaService } from '../../../../services/consulta.service';
import { ChicoService } from '../../../../services/chico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [BarGraphComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.css',
})
export class GeneralComponent implements OnInit {
  currentYear: number;
  lastFourYears: number[];
  loading = true;
  constructor(
    private _consultaService: ConsultaService,
    private _chicoService: ChicoService,
    private snackBar: MatSnackBar,
  ) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }

  dataChicosxAnio: any = [];
  dataConsultaxAnio: any = [];
  dataTipoConsultaxanio: any = [];

  ngOnInit(): void {
    this.obtenerGraficos();
  }
  async obtenerGraficos() {
    const promesas = [this.countChicosCargados(), this.countConsultasxanio(), this.countTypeConsultaxanio()];
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
}
