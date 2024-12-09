import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { Localidad } from '../../../models/localidad.model';
import { LocalidadService } from '../../../services/localidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ModalLocalidadComponent } from './modal-localidad/modal-localidad.component';

@Component({
  selector: 'app-localidades',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginatorModule, LoadingComponent, MatSortModule, TooltipModule],
  templateUrl: './localidades.component.html',
  styleUrl: './localidades.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class LocalidadesComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public localidades: MatTableDataSource<Localidad>;
  public resultsLength = 0;
  public searching = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('localidadModal') localidadModal!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['numero', 'nombre', 'cantidadBarrios', 'estado', 'action'];
  constructor(
    private _localidadService: LocalidadService,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) {
    this.localidades = new MatTableDataSource<Localidad>([]);
    this.localidades.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'estado':
          return item.deshabilitado ? 1 : 0;
        default:
          return item[property];
      }
    };
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  ngAfterViewInit() {
    this.localidades.paginator = this.paginador;
    this.localidades.sort = this.sort;
  }

  obtenerLocalidades() {
    this.searching = true;
    this._localidadService.obtenerTodasLocalidades().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.localidades.data = response.data;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.localidades.filter = filterValue.trim().toLowerCase();
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar localidad?',
      text: 'La localidad se hará visible para los usuarios y podrán cargar niños a esta.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modifcarLocalidad(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar localidad?',
      text: 'La localidad dejará de ser visible para los usuarios y no se podrán cargar más niños a esta.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modifcarLocalidad(id, edit);
      }
    });
  }

  modifcarLocalidad(id: number, edit: any) {
    this._localidadService.modificarLocalidad(id, edit).subscribe({
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
      text: 'Para poder editar la localidad, usted debe habilitarla',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar localidad',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modifcarLocalidad(id, edit);
      }
    });
  }

  editarLocalidad(localidad: Localidad) {
    const modal = this._dialog.open(ModalLocalidadComponent, { panelClass: 'full-screen-dialog', data: { localidad } });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerLocalidades();
      }
    });
  }

  nuevaLocalidad() {
    const modal = this._dialog.open(ModalLocalidadComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerLocalidades();
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    else this._liveAnnouncer.announce('Orden eliminado');
  }
}
