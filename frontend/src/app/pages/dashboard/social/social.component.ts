import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { YearGradoFormComponent } from '../components/year-grado-form/year-grado-form.component';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { ConsultaService } from '@app/services/consulta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridChangerComponent } from '../components/grid-changer/grid-changer.component';
import { CommonModule } from '@angular/common';
import { PieGraphComponent } from '../components/graphs/pie-graph.component';
import { BarGraphComponent } from '../components/graphs/bar-graph.component';
import { ExpandCompressButtonComponent } from '../components/expand-compress-button/expand-compress-button.component';
import { CategoriaService } from '@app/services/categoria.service';
import { Categoria } from '@app/models/categoria.model';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [YearGradoFormComponent, GridChangerComponent, CommonModule, ExpandCompressButtonComponent, BarGraphComponent],
  templateUrl: './social.component.html',
})
export class SocialComponent implements OnInit {
  @ViewChildren(BarGraphComponent) barGraphs!: QueryList<BarGraphComponent>;
  @ViewChildren(PieGraphComponent) pieGraphs!: QueryList<PieGraphComponent>;
  loading = true;
  grid = 3;
  year = 0;
  id_curso = 0;
  porcentaje = 0;
  subTitulo = '';
  cursoLabel = '';
  currentYear: number;
  lastFourYears: number[];

  categorias: Categoria[] = [];
  dataTipoConsultaPorCategoria: any = [];
  constructor(
    private _consultaService: ConsultaService,
    private snackBar: MatSnackBar,
    private _categoriaService: CategoriaService,
  ) {
    this.currentYear = new Date().getFullYear();
    this.lastFourYears = [this.currentYear - 3, this.currentYear - 2, this.currentYear - 1, this.currentYear];
  }

  ngOnInit() {
    this.obtenerGraficos();
    this.obtenerCategorias();
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
      // agrego todos los graficos que correspondan
      this.obtenerGraficoConsultasxCategoria(),
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

  obtenerGraficoConsultasxCategoria() {
    return new Promise((resolve, reject) => {
      this._consultaService.countConsultasByCategoria(this.currentYear, this.id_curso, this.porcentaje).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.dataTipoConsultaPorCategoria = [];
            for (const year of this.lastFourYears) {
              this.dataTipoConsultaPorCategoria.push({
                label: '' + year,
                data: response.data[year],
              });
            }
            console.log(this.dataTipoConsultaPorCategoria);
          }
          resolve(true);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  obtenerCategorias() {
    this.loading = true;
    this._categoriaService.obtenerCategorias().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.categorias = response.data;
          this.categorias = response.data.map((cat: Categoria) => cat.nombre)
        }
        this.loading = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.loading = false;
      },
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
