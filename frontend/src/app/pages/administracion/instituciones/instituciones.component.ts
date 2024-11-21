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

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { Institucion } from '../../../models/institucion.model';
import { InstitucionService } from '../../../services/institucion.service';
import { ModalInstitucionComponent } from './modal-institucion/modal-institucion.component';

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginatorModule, LoadingComponent, MatSortModule],
  templateUrl: './instituciones.component.html',
  styleUrl: './instituciones.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class InstitucionesComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public instituciones: MatTableDataSource<Institucion>;
  public resultsLength = 0;
  public searching = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('institucionModal') institucionModal!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['numero', 'nombre', 'tipo', 'cantidadConsultas', 'habilitado', 'action'];
  constructor(
    private _institucionService: InstitucionService,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) {
    this.instituciones = new MatTableDataSource<Institucion>([]);
  }

  ngOnInit(): void {
    this.obtenerInstituciones();
  }

  ngAfterViewInit() {
    this.instituciones.paginator = this.paginador;
    this.instituciones.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    } else {
      this._liveAnnouncer.announce('Orden eliminado');
    }
  }

  obtenerInstituciones() {
    this.searching = true;
    this._institucionService.obtenerTodasInstituciones().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.instituciones.data = response.data;
          this.resultsLength = response.data.length;
          console.log(this.instituciones);
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
    this.instituciones.filter = filterValue.trim().toLowerCase();
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar institucion?',
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
    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerInstituciones();
      }
    });
  }

  nuevaInstitucion() {
    const modal = this._dialog.open(ModalInstitucionComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerInstituciones();
      }
    });
  }
}
