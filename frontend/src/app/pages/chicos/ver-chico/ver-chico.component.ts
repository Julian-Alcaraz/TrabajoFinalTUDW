import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { Chico } from '../../../models/chico.model';
import { ChicoService } from '../../../services/chico.service';
import { Consulta } from '../../../models/consulta.model';
import { DetallesConsultaComponent } from '../components/detalles-consulta/detalles-consulta.component';

@Component({
  selector: 'app-ver-chico',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe, RouterModule, DetallesConsultaComponent],
  templateUrl: './ver-chico.component.html',
  styleUrl: './ver-chico.component.css',
})
export class VerChicoComponent implements OnInit {
  public idConsulta: number | null = null;
  public chico: Chico | null = null;
  public consultas: MatTableDataSource<Consulta>;
  public resultsLength = 0;
  public consultasColumns: string[] = ['numero', 'tipo', 'fecha', 'profesional', 'obra_social', 'edad',
    //  'institucion', 'curso', 'turno',
     'observaciones'];

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;

  constructor(
    private _chicoService: ChicoService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.consultas = new MatTableDataSource<Consulta>([]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idChicoString = params.get('id');
      if (idChicoString) {
        const idChico = parseInt(idChicoString);
        if (!isNaN(idChico)) {
          this.obtenerChico(idChico);
          this._chicoService.obtenerConsultasDeChico(idChico).subscribe({
            next: (response: any) => {
              if (response.success) {
                this.consultas.data = response.data;
                this.resultsLength = response.data.length;
              }
            },
            error: (err: any) => {
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
        } else {
          console.log('El ID proporcionado no es un número válido.');
          // Manejar el caso en que el ID no es un número
        }
      } else {
        console.log('No se proporcionó un ID válido.');
        // Manejar el caso en que no se proporcionó un ID
      }
    });
  }

  obtenerChico(id: number) {
    this._chicoService.obtenerChicoxId(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.chico = response.data;
        }
      },
      error: (err) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  // Podria haber una mejor solucion
  obtenerConsulta(id: number) {
    this.idConsulta = id;
  }
}
