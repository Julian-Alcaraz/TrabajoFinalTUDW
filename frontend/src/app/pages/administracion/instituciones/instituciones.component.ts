import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginadorPersonalizado } from '@utils/paginador/paginador-personalizado';
import { LoadingComponent } from '@components/loading/loading.component';
import { Institucion } from '@models/institucion.model';
import { InstitucionService } from '@services/institucion.service';
import { ModalInstitucionComponent } from './modal-institucion/modal-institucion.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginatorModule, LoadingComponent, MatSortModule, TooltipModule, PanelModule, IftaLabelModule, SelectModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './instituciones.component.html',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class InstitucionesComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public con = Constantes;
  public tipoControl: FormControl = new FormControl(null);
  public estadoControl: FormControl = new FormControl(null);
  public instituciones: MatTableDataSource<Institucion>;
  public searching = false;
  public resultsLength = 0;
  public searchTerms: any = {};
  public colapsarFiltros = true;
  public mensajes = '';
  public estadoOptions: any[] = [
    { nombre: 'Habilitado', valor: false },
    { nombre: 'Deshabilitado', valor: true },
  ];
  public tipoOptions: string[] = this.con.TipoInstitucionEnum;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('institucionModal') institucionModal!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['numero', 'nombre', 'tipo', 'cantidadConsultas', 'estado', 'action'];
  constructor(
    private snackBar: MatSnackBar,
    private _institucionService: InstitucionService,
    private _dialog: MatDialog,
  ) {
    this.instituciones = new MatTableDataSource<Institucion>([]);
    this.instituciones.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'estado':
          return item.deshabilitado ? 1 : 0;
        default:
          return item[property];
      }
    };
  }

  ngOnInit(): void {
    this.obtenerInstituciones();
    this.activateTableFilter();
  }

  ngAfterViewInit() {
    this.instituciones.paginator = this.paginador;
    this.instituciones.sort = this.sort;
  }

  obtenerInstituciones() {
    this.searching = true;
    this._institucionService.obtenerTodasInstituciones().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.instituciones.data = response.data;
          this.resultsLength = response.data.length;
        }
        this.searching = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searching = false;
      },
    });
  }

  activateTableFilter() {
    this.instituciones.filterPredicate = (institucion: any, filter: string) => {
      const searchTerms = JSON.parse(filter);

      const matchesEstado = searchTerms.estado !== undefined ? institucion.deshabilitado === JSON.parse(searchTerms.estado) : true;
      const matchesTipo = searchTerms.tipo ? String(institucion.tipo) === searchTerms.tipo : true;
      const matchesNombre = searchTerms.nombre ? sacarAcentos(institucion.nombre.toLowerCase()).includes(searchTerms.nombre.toLowerCase()) : true;

      this.actualizarMensajes(searchTerms.nombre, searchTerms.estado, searchTerms.tipo);
      return matchesNombre && matchesEstado && matchesTipo;
    };
  }

  applyFilter(event: any, filtro: string) {
    if (filtro === 'filtroNombre') {
      const nombreValue = sacarAcentos(event.target.value.trim().toLowerCase());
      this.searchTerms.nombre = nombreValue || undefined;
    } else if (filtro === 'filtroTipo') {
      const tipoValue = event.value;
      this.searchTerms.tipo = tipoValue !== undefined ? tipoValue : undefined;
    } else if (filtro === 'filtroEstado') {
      const estadoValue = event.value;
      this.searchTerms.estado = estadoValue !== undefined ? estadoValue : undefined;
    }
    this.instituciones.filter = JSON.stringify(this.searchTerms);
    if (this.instituciones.paginator) this.instituciones.paginator.firstPage();
  }

  actualizarMensajes(filtroNombre: any, filtroEstado: any, filtroTipo: any): void {
    this.mensajes = 'No se encontró una institución con:';
    if (filtroNombre) this.mensajes += ` Nombre: '${filtroNombre}'. `;
    if (filtroTipo) this.mensajes += ` Tipo: ${filtroTipo}. `;
    if (filtroEstado) this.mensajes += ` Estado: ${filtroEstado ? 'Deshabilitado' : 'Habilitado'}.`;
  }

  limpiarFiltroEstado() {
    this.searchTerms.estado = undefined;
    this.instituciones.filter = JSON.stringify(this.searchTerms);
    if (this.instituciones.paginator) this.instituciones.paginator.firstPage();
  }

  limpiarFiltroTipo() {
    this.searchTerms.tipo = undefined;
    this.instituciones.filter = JSON.stringify(this.searchTerms);
    if (this.instituciones.paginator) this.instituciones.paginator.firstPage();
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar institucion?',
      text: 'La institución se hará visible para los usuarios y podrán cargar consultas a esta.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modifcarInstitucion(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar institucion?',
      text: 'La institución dejará de ser visible para los usuarios y no se podrán cargar más consultas a esta.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modifcarInstitucion(id, edit);
      }
    });
  }

  modifcarInstitucion(id: number, edit: any) {
    this._institucionService.modificarInstitucion(id, edit).subscribe({
      next: (response: any) => {
        if (response.success) {
          MostrarNotificacion.mensajeExito(this.snackBar, response.message);
          this.ngOnInit();
        } else {
          MostrarNotificacion.mensajeError(this.snackBar, response.message);
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  notificar(id: number) {
    Swal.fire({
      title: 'Error',
      text: 'Para poder editar la institucion, usted debe habilitarla',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar institucion',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modifcarInstitucion(id, edit);
      }
    });
  }

  editarInstitucion(institucion: Institucion) {
    const modal = this._dialog.open(ModalInstitucionComponent, { panelClass: 'full-screen-dialog', data: { institucion } });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerInstituciones();
      }
    });
  }

  nuevaInstitucion() {
    const modal = this._dialog.open(ModalInstitucionComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerInstituciones();
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    else this._liveAnnouncer.announce('Orden eliminado');
  }
}

function sacarAcentos(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
