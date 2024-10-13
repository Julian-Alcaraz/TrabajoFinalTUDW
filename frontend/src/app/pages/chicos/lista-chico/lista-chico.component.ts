import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';

import { Chico } from '../../../models/chico.model';
import { ChicoService } from '../../../services/chico.service';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';

@Component({
  selector: 'app-lista-chico',
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe],
  templateUrl: './lista-chico.component.html',
  styleUrl: './lista-chico.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})

export class ListaChicoComponent {
  public chicos: MatTableDataSource<Chico>;
  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  // @ViewChild(MatSort) sort: MatSort;

  public resultsLength = 0;

  displayedColumns: string[] = ['nombre', 'apellido', 'documento','fechaNac', 'sexo', 'direccion', 'telefono' ,'nombrePadre', 'nombreMadre'];
  constructor(
    private _chicoService: ChicoService,
    private snackBar: MatSnackBar,
  ) {
    this.chicos = new MatTableDataSource<Chico>([]);
  }

  ngOnInit(): void {
    this._chicoService.obtenerChicos().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.chicos.data = response.data;
          this.resultsLength = response.data.length;
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }
}
