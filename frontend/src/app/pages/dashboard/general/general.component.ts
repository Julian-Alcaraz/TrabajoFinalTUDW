import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { ConsultaService } from '@services/consulta.service';
import { ChicoService } from '@services/chico.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { InstitucionService } from '@services/institucion.service';
import { Institucion } from '@models/institucion.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { Select } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GridChangerComponent } from '../components/grid-changer/grid-changer.component';
import * as Constantes from '@app/common/const/const';
import { ExpandCompressButtonComponent } from '../components/expand-compress-button/expand-compress-button.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, GridChangerComponent, ButtonModule, ReactiveFormsModule, IftaLabelModule, ExpandCompressButtonComponent, DatePickerModule, BarGraphComponent, PieGraphComponent, LoadingComponent, Select],
  templateUrl: './general.component.html',
})
export class GeneralComponent implements OnInit, AfterViewInit {
  grid = 3;
  currentYear: number;
  lastFourYears: number[];
  loading = true;
  subTituloYear = '';
  subTituloInstitucion = '';
  maxDate: any;

  instituciones: Institucion[] = [];
  selectedYear = 0;
  selectedId_institucion = 0;

  institucionSeleccionada = new FormControl();
  dataTypeYearAndInstitucion: any = [];

  dataChicosxAnio: any = [];
  dataConsultaxAnio: any = [];
  dataTipoConsultaxanio: any = [];
  searchingInstituciones = false;
  // este no lo cambio por que sino pierdo el trabajo social
  arrayConsultas: string[] = [...Constantes.typeConsultasEnum];
  // arrayConsultas = ['Clinica', 'Odontologia', 'Oftalmologia', 'Fonoaudiologia', 'Prevención', 'Trabajo Social'];
  constructor(
    private _consultaService: ConsultaService,
    private _chicoService: ChicoService,
    private snackBar: MatSnackBar,
    private _institucionService: InstitucionService,
    private cdr: ChangeDetectorRef,
  ) {
    this.maxDate = new Date();
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }
  @ViewChildren(BarGraphComponent) barGraphs!: QueryList<BarGraphComponent>;
  @ViewChildren(PieGraphComponent) pieGraphs!: QueryList<PieGraphComponent>;

  ngOnInit(): void {
    this.obtenerInstituciones();
    this.onResize({ target: window });
  }

  ngAfterViewInit() {
    this.obtenerGraficos();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const width = event.target.innerWidth;

    if (width < 640) {
      this.grid = 1; // `sm`
    } else if (width < 1024) {
      this.grid = 2; // `md`
    } else {
      this.grid = 3; // `lg`
    }

    this.actualizarGraficos();
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
    this.actualizarGraficos();
  }

  async obtenerGraficos() {
    const promesas = [this.countChicosCargados(), this.countConsultasxanio(), this.countTypeConsultaxanio(), this.obtenerGraficoByYearAndInstitucion()];
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
  countChicosCargados() {
    return new Promise((resolve, reject) => {
      this._chicoService.countChicosCargadosxAnios(this.currentYear).subscribe({
        next: (response: any) => {
          this.dataChicosxAnio = [];
          if (response.success) {
            this.dataChicosxAnio.push({
              label: 'Niños',
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
    this.selectedYear = event ? +event.getFullYear() : 0;
    if (this.selectedYear === 0) {
      this.subTituloYear = '';
    } else {
      this.subTituloYear = '(' + this.selectedYear + ')';
    }
    this.obtenerGraficoByYearAndInstitucion();
  }

  seleccionarInstituciones(event: any) {
    this.selectedId_institucion = +event.value;
    if (this.selectedId_institucion === 0) {
      this.subTituloInstitucion = '';
    } else {
      const institucionSelected = this.instituciones.filter((inst) => this.selectedId_institucion === inst.id);
      this.subTituloInstitucion = ' ' + institucionSelected[0].nombre;
    }
    this.obtenerGraficoByYearAndInstitucion();
  }

  obtenerInstituciones() {
    this.searchingInstituciones = true;
    this._institucionService.obtenerInstituciones().subscribe({
      next: (response: any) => {
        this.searchingInstituciones = false;
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
