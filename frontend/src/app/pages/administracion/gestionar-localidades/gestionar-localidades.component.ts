import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
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
import { ValidarCadenaSinEspacios } from '../../../utils/validadores';
import { ModalLocalidadComponent } from './components/modal-localidad/modal-localidad.component';

@Component({
  selector: 'app-gestionar-localidades',
  standalone: true,
  imports: [CommonModule, TagModule, MatTableModule, MatPaginatorModule, LoadingComponent, MatSortModule],
  templateUrl: './gestionar-localidades.component.html',
  styleUrl: './gestionar-localidades.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class GestionarLocalidadesComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  public localidadForm: FormGroup;
  public localidades: MatTableDataSource<Localidad>;
  public resultsLength = 0;
  public searching = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  @ViewChild('localidadModal') localidadModal!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['numero', 'nombre', 'cantidadBarrios', 'habilitado', 'action'];
  constructor(
    private _localidadService: LocalidadService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private _dialog: MatDialog,
  ) {
    this.localidades = new MatTableDataSource<Localidad>([]);
    this.localidadForm = this.fb.group({
      nombre_localidad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
  }

  ngAfterViewInit() {
    this.localidades.paginator = this.paginador;
    this.localidades.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Ordenado ${sortState.direction}`);
    } else {
      this._liveAnnouncer.announce('Orden eliminado');
    }
  }

  obtenerLocalidades() {
    this.searching = true;
    this._localidadService.obtenerTodasLocalidades().subscribe({
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
    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerLocalidades();
      }
    });
  }

  nuevaLocalidad() {
    const modal = this._dialog.open(ModalLocalidadComponent, { panelClass: 'full-screen-dialog' });
    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.obtenerLocalidades();
      }
    });
  }
}
