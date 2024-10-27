import { DatePipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { Chico } from '../../../models/chico.model';
import { ChicoService } from '../../../services/chico.service';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-lista-chico',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe, RouterModule],
  templateUrl: './lista-chico.component.html',
  styleUrl: './lista-chico.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class ListaChicoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  public chicos: MatTableDataSource<Chico>;
  public resultsLength = 0;
  public searching = false;
  public displayedColumns: string[] = ['numero', 'nombre', 'apellido', 'documento', 'fechaNac', 'sexo', 'direccion', 'telefono', 'nombrePadre', 'nombreMadre', 'action'];

  constructor(
    private _chicoService: ChicoService,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.chicos = new MatTableDataSource<Chico>([]);
  }

  ngOnInit(): void {
    this.getChicos();
    this.activateTableFilter();
  }

  ngAfterViewInit() {
    this.chicos.paginator = this.paginador;
  }

  getChicos() {
    this.searching = true;
    this._chicoService.obtenerChicos().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.chicos.data = response.data;
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
    this.chicos.filterPredicate = (data: Chico, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return searchTerms.dni ? String(data.dni).startsWith(searchTerms.dni) : true;
    };
  }

  notificar(id: number) {
    Swal.fire({
      title: 'Error',
      text: 'Para poder ver sus consultas o editar los datos personales del chico, usted debe habilitar al chico',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Habilitar chico',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.habilitar(id);
      }
    });
  }

  habilitar(id: number) {
    Swal.fire({
      title: '¿Habilitar chico?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: false };
        this.modificarChico(id, edit);
      }
    });
  }

  inhabilitar(id: number) {
    Swal.fire({
      title: '¿Deshabilitar chico?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result: any) => {
      if (result.isConfirmed) {
        const edit = { deshabilitado: true };
        this.modificarChico(id, edit);
      }
    });
  }

  modificarChico(id: number, edit: any) {
    this._chicoService.modificarChico(id, edit).subscribe({
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

  applyFilterToAllRow(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.chicos.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const dniValue = (event.target as HTMLInputElement).value; // esto lo dejo por que por el momento es solo por dni
    const searchTerms = {
      ...(dniValue && { dni: dniValue }),
    };

    this.chicos.filter = JSON.stringify(searchTerms);
    if (this.chicos.paginator) {
      this.chicos.paginator.firstPage();
    }
  }

  editarChico(id: number) {
    this._router.navigate(['/layout/chicos/'+id+'/editar']);
  }

  verDetallesChico(id: number) {
    this._router.navigate(['/layout/chicos', id]);
  }
}
