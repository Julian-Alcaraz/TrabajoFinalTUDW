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
import { ConsultaService } from '../../../services/consulta.service';

@Component({
  selector: 'app-ver-chico',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule, DatePipe, RouterModule],
  templateUrl: './ver-chico.component.html',
  styleUrl: './ver-chico.component.css',
})
export class VerChicoComponent implements OnInit {
  idChico: number | null = null;
  chico: Chico | null = null;
  mostrarDetalles = false;

  @ViewChild(MatPaginator) paginador: MatPaginator | null = null;
  public consultas: MatTableDataSource<Consulta>;
  public consulta: MatTableDataSource<Consulta>; //| null = null;
  public resultsLength = 0;
  public hayConsulta = false;
  public consultaDataSource!: Consulta;

  consultasColumns: string[] = ['numero', 'tipo', 'fecha', 'profesional', 'obra_social', 'edad', 'curso', 'institucion', 'turno', 'observaciones'];
  consultaColumns: string[] = [];

  constructor(
    private _chicoService: ChicoService,
    private _consultaService: ConsultaService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.consultas = new MatTableDataSource<Consulta>([]);
    this.consulta = new MatTableDataSource<Consulta>([]);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idChicoParam = params.get('id');
      if (idChicoParam) {
        const parsedId = parseInt(idChicoParam);
        if (!isNaN(parsedId)) {
          this.idChico = parsedId;
          this.obtenerChico(this.idChico);
          this._chicoService.obtenerConsultasDeChico(parsedId).subscribe({
            next: (response: any) => {
              if (response.success) {
                this.consultas.data = response.data;
                this.resultsLength = response.data.length;
                console.log(this.consultas.data);
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

  updateColumnDefinitions() {
    this.consultaColumns = [];
    switch (this.consultaDataSource.type) {
      case 'Odontologia':
        this.consultaColumns.push('cepillado');
        this.consultaColumns.push('cepillo');
        this.consultaColumns.push('clasificacion');
        this.consultaColumns.push('derivacion');
        this.consultaColumns.push('dientes_norecuperables');
        this.consultaColumns.push('dientes_permanentes');
        this.consultaColumns.push('dientes_recuperables');
        this.consultaColumns.push('dientes_temporales');
        this.consultaColumns.push('habitos');
        this.consultaColumns.push('primera_vez');
        this.consultaColumns.push('sellador');
        this.consultaColumns.push('situacion_bucal');
        this.consultaColumns.push('topificacion');
        this.consultaColumns.push('ulterior');
        break;
      case 'Clinica':
        this.consultaColumns.push('diabetes');
        this.consultaColumns.push('hta');
        this.consultaColumns.push('obesidad');
        this.consultaColumns.push('consumo_alcohol');
        this.consultaColumns.push('consumo_drogas');
        this.consultaColumns.push('antecedentes_perinatal');
        this.consultaColumns.push('enfermedades_previas');
        this.consultaColumns.push('vacunas');
        this.consultaColumns.push('peso');
        this.consultaColumns.push('talla');
        this.consultaColumns.push('pct');
        this.consultaColumns.push('cc');
        this.consultaColumns.push('pcimc');
        this.consultaColumns.push('tas');
        this.consultaColumns.push('tad');
        this.consultaColumns.push('pcta');
        this.consultaColumns.push('examen_visual');
        this.consultaColumns.push('ortopedia_traumatologia');
        this.consultaColumns.push('lenguaje');
        this.consultaColumns.push('segto');
        this.consultaColumns.push('alimentacion');
        this.consultaColumns.push('hidratacion');
        this.consultaColumns.push('lacteos');
        this.consultaColumns.push('infusiones');
        this.consultaColumns.push('numero_comidas');
        this.consultaColumns.push('horas_pantalla');
        this.consultaColumns.push('horas_juego_airelibre');
        this.consultaColumns.push('horas_suenio');
        this.consultaColumns.push('proyecto');
        break;
      case 'Fonoaudiologia':
        this.consultaColumns.push('asistencia');
        this.consultaColumns.push('diagnostico_presuntivo');
        this.consultaColumns.push('causas');
        break;
      case 'Oftalmologia':
        this.consultaColumns.push('demanda');
        this.consultaColumns.push('primera_vez');
        this.consultaColumns.push('control');
        this.consultaColumns.push('receta');
        this.consultaColumns.push('anteojos');
        this.consultaColumns.push('prox_control');
        break;
    }
    // this.consultaColumns.push('');
    console.log(this.consultaColumns);
  }

  obtenerChico(id: number) {
    this._chicoService.obtenerChicoxId(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.chico = response.data;
          console.log(this.chico);
        }
      },
      error: (err) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  obtenerConsulta(idConsulta: number) {
    this._consultaService.obtenerConsultaxId(idConsulta).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success) {
          this.consulta = new MatTableDataSource<Consulta>([response.data]);
          this.consultaDataSource = this.consulta.data[0];
          this.hayConsulta = true;
          this.updateColumnDefinitions();
          console.log('LA CONSULTA CON MAS DATOS ES:');
          //console.log(this.consulta);
          console.log(this.consultaDataSource);
        }
      },
      error: (err) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.hayConsulta = false;
      },
    });
    this.hayConsulta = false;
  }
}
