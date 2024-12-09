import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { BarrioService } from '@services/barrio.service';
import { Barrio } from '@models/barrio.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { PaginadorPersonalizado } from '@utils/paginador/paginador-personalizado';
import { ModalBarrioComponent } from './modal-barrio/modal-barrio.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-barrios',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginatorModule, LoadingComponent, MatSortModule, TooltipModule],
  templateUrl: './barrios.component.html',
  styleUrl: './barrios.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class BarriosComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public barrios: MatTableDataSource<Barrio>;
  public resultsLength = 0;
  public searching = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('barrioModal') barrioModal!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['numero', 'nombre', 'nombre_localidad', 'estado', 'action'];
  constructor(
    private _barrioService: BarrioService,
    private _dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.barrios = new MatTableDataSource<Barrio>([]);
    this.barrios.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'estado':
          return item.deshabilitado ? 1 : 0;
        default:
          return item[property];
      }
    };
  }

  ngOnInit(): void {
    this.obtenerBarrios();
  }

  ngAfterViewInit() {
    this.barrios.paginator = this.paginador;
    this.barrios.sort = this.sort;
  }

  obtenerBarrios() {
    this.searching = true;
    this._barrioService.obtenerTodosBarrios().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.barrios.data = response.data;
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
    this.barrios.filter = filterValue.trim().toLowerCase();
  }

  notificar(id: number) {
    Swal.fire({
      title: 'Error',
      text: 'Para poder editar el barrio, usted debe habilitarlo',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar barrio',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.habilitar(id);
      }
    });
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar barrio?',
      text: 'El barrio se hará visible para los usuarios y podrán cargar niños a este.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modificarBarrio(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar barrio?',
      text: 'El barrio dejará de ser visible para los usuarios y no se podrán cargar más niños a este.',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modificarBarrio(id, edit);
      }
    });
  }

  modificarBarrio(id: number, edit: any) {
    this._barrioService.modificarBarrio(id, edit).subscribe({
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

  editarBarrio(barrio: Barrio) {
    const modal = this._dialog.open(ModalBarrioComponent, { panelClass: 'full-screen-dialog', data: { barrio } });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerBarrios();
      }
    });
  }

  nuevoBarrio() {
    const modal = this._dialog.open(ModalBarrioComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((actualizar) => {
      if (actualizar) {
        this.obtenerBarrios();
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    else this._liveAnnouncer.announce('Orden eliminado');
  }
}
