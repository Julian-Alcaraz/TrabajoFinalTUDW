import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatPaginatorIntl } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { Chico } from '../../../models/chico.model';
import { ChicoService } from '../../../services/chico.service';
import { Consulta } from '../../../models/consulta.model';
import { PaginadorPersonalizado } from '../../../utils/paginador/paginador-personalizado';
import { ConsultasTableComponent } from '../../busquedas/components/consultas-table/consultas-table.component';
import { LoadingComponent } from '../../../components/loading/loading.component';

@Component({
  selector: 'app-ver-chico',
  standalone: true,
  imports: [CommonModule,  MatInputModule, MatFormFieldModule, RouterModule, LoadingComponent, ConsultasTableComponent],
  templateUrl: './ver-chico.component.html',
  styleUrl: './ver-chico.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginadorPersonalizado }],
})
export class VerChicoComponent implements OnInit {
  public idConsulta: number | null = null;
  public chico: Chico | null = null;

  public consultas: Consulta[] = [];
  public consultasComplete: Consulta[] = [];
  // public consultas: MatTableDataSource<Consulta>;
  public resultsLength = 0;
  public consultasColumns: string[] = ['numero', 'type', 'fecha', 'obra_social', 'profesional', 'observaciones'];
  public searchingChico = false;
  public searchingConsultas = false;

  constructor(
    private _chicoService: ChicoService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location,
  ) {
    // this.consultas = new MatTableDataSource<Consulta>([]);
  }

  ngOnInit(): void {
    this.obtenerConsultasxChico();
  }

  obtenerConsultasxChico() {
    this.searchingChico = true;
    this.searchingConsultas = true;
    this.route.paramMap.subscribe((params) => {
      const idChicoString = params.get('id');
      if (idChicoString) {
        const idChico = parseInt(idChicoString);
        if (!isNaN(idChico)) {
          this.obtenerChico(idChico);
          this.obtenerConsultas(idChico);
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

  obtenerConsultas(idChico: number) {
    this._chicoService.obtenerConsultasDeChico(idChico).subscribe({
      next: (response: any) => {
        if (response.success) {
          // this.consultas.data = response.data;
          this.consultas = response.data;
          this.consultasComplete = response.data;
          this.resultsLength = response.data.length;
        }
        this.searchingConsultas = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searchingConsultas = false;
      },
    });
  }

  obtenerChico(id: number) {
    this._chicoService.obtenerChicoxId(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.chico = response.data;
        }
        this.searchingChico = false;
      },
      error: (err) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searchingChico = false;
      },
    });
  }

  // Podria haber una mejor solucion
  obtenerConsulta(id: number) {
    this.idConsulta = id;
  }

  volver() {
    this.location.back();
  }
  public typeFiltered: string[] = [];

  onChangeCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox?.checked) {
      this.typeFiltered.push(checkbox.value);
    } else {
      this.typeFiltered = this.typeFiltered.filter((item) => item !== checkbox.value);
    } // Filtrar las consultas completas con los tipos seleccionados
    this.consultas = this.consultasComplete.filter((consulta: Consulta) => this.typeFiltered.length === 0 || this.typeFiltered.includes(consulta.type));
    console.log(this.consultas)
  }
}
