import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { Taller } from '@app/models/taller.model';
import { LoadingComponent } from '@components/loading/loading.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TallerService } from '@app/services/taller.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-taller',
  standalone: true,
  imports: [MatTableModule, MatSortModule, TagModule, TooltipModule, LoadingComponent, MatPaginator, MatPaginatorModule],
  templateUrl: './lista-taller.component.html',
  styleUrl: './lista-taller.component.css',
})
export class ListaTallerComponent implements OnInit {
  public talleres: MatTableDataSource<Taller>;
  public displayedColumns: string[] = ['numero', 'nombre', 'fecha', 'duracion', /*'turno', 'conjuntoCon',*/ 'frecuencia', 'destinatarios', 'action'];

  public searching = true;
  public resultsLength = 0;
  private _liveAnnouncer = inject(LiveAnnouncer);

  constructor(
    private _tallerService: TallerService,
    private snackBar: MatSnackBar,
  ) {
    this.talleres = new MatTableDataSource<Taller>([]);
  }

  ngOnInit(): void {
    this.obtenerTalleres();
  }

  obtenerTalleres() {
    this.searching = true;
    this._tallerService.obtenerTodosTalleres().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.talleres.data = response.data;
          this.resultsLength = response.data.length;
        }
        this.searching = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searching = false;
      },
    });
    console.log(this.talleres);
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar taller?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modificarTaller(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar taller?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modificarTaller(id, edit);
      }
    });
  }

  modificarTaller(id: number, edit: any) {
    this._tallerService.modificarTaller(id, edit).subscribe({
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
      text: 'Para poder ver o editar el taller, usted debe habilitarlo',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar taller',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.habilitar(id);
      }
    });
  }

  editarTaller(id: number) {
    console.log('falta', id);
    /*
    const dialogRef = this._dialog.open(EditarChicoComponent, { panelClass: 'full-screen-dialog', data: { id } });
    dialogRef.afterClosed().subscribe((recargar) => {
      if (recargar) {
        this.obtenerChicos();
      }
    });
  }
    */
  }

  verDetallesTaller(id: number) {
    console.log('falta', id);
    // this._router.navigate(['/layout/chicos/ver', id]);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    else this._liveAnnouncer.announce('Orden eliminado');
  }
}
