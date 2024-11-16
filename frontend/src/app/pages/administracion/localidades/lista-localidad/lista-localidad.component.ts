import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TagModule } from 'primeng/tag';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { Localidad } from '../../../../models/localidad.model';
import { LocalidadService } from '../../../../services/localidad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginadorPersonalizado } from '../../../../utils/paginador/paginador-personalizado';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import Swal from 'sweetalert2';

// sort...
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {inject  } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-lista-localidad',
  standalone: true,
  imports: [TagModule, MatTableModule, MatPaginator, MatPaginatorModule, LoadingComponent, MatSortModule],
  templateUrl: './lista-localidad.component.html',
  styleUrl: './lista-localidad.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaLocalidadComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public localidades: MatTableDataSource<Localidad>;
  public resultsLength = 0;
  public searching = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['numero', 'nombre', 'habilitado', 'action'];
  constructor(
    private _localidadService: LocalidadService,
    private snackBar: MatSnackBar,
  ) {
    this.localidades = new MatTableDataSource<Localidad>([]);
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  ngAfterViewInit() {
    this.localidades.paginator = this.paginador;
    this.localidades.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  obtenerLocalidades() {
    this.searching = true;
    this._localidadService.obtenerLocalidades().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.localidades.data = response.data;
          this.resultsLength = response.data.length;
          console.log(this.localidades);
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
}
