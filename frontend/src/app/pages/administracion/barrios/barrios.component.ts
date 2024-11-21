import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { BarrioService } from '../../../services/barrio.service';
import { Barrio } from '../../../models/barrio.model';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { ModalBarrioComponent } from './modal-barrio/modal-barrio.component';

@Component({
  selector: 'app-barrios',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginatorModule, LoadingComponent, MatSortModule],
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

  displayedColumns: string[] = ['numero', 'nombre', 'nombre_localidad', 'habilitado', 'action'];
  constructor(
    private _barrioService: BarrioService,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) {
    this.barrios = new MatTableDataSource<Barrio>([]);
  }

  ngOnInit(): void {
    this.obtenerBarrios();
  }

  ngAfterViewInit() {
    this.barrios.paginator = this.paginador;
    this.barrios.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    else this._liveAnnouncer.announce('Orden eliminado');
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
    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerBarrios();
      }
    });
  }

  nuevoBarrio() {
    const modal = this._dialog.open(ModalBarrioComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerBarrios();
      }
    });
  }
}
