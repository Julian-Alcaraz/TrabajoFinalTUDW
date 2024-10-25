import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { Consulta } from '../../../../models/consulta.model';
import { ConsultaService } from '../../../../services/consulta.service';

@Component({
  selector: 'app-detalles-consulta',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginator, MatPaginatorModule],
  templateUrl: './detalles-consulta.component.html',
  styleUrl: './detalles-consulta.component.css',
})
export class DetallesConsultaComponent implements OnChanges, OnInit {
  @Input() idConsulta: number | null = null;

  public consulta: MatTableDataSource<Consulta>;
  public consultaDataSource!: Consulta;
  public consultaColumns: string[] = [];
  public hayConsulta = false;

  constructor(
    private _consultaService: ConsultaService,
    private snackBar: MatSnackBar,
  ) {
    this.consulta = new MatTableDataSource<Consulta>([]);
  }

  ngOnInit() {
    if (this.idConsulta) {
      this._consultaService.obtenerConsultaxId(this.idConsulta).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.consulta = new MatTableDataSource<Consulta>([response.data]);
            this.consultaDataSource = this.consulta.data[0];
            this.hayConsulta = true;
            console.log('DATASOURCE:');
            console.log(this.consultaDataSource);
            this.obtenerColumnas();
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

  ngOnChanges() {
    if (this.idConsulta) {
      this._consultaService.obtenerConsultaxId(this.idConsulta).subscribe({
        next: (response: any) => {
          console.log(response)
          if (response.success) {
            this.consulta = new MatTableDataSource<Consulta>([response.data]);
            this.consultaDataSource = this.consulta.data[0];
            this.hayConsulta = true;
            console.log('DATASOURCE:');
            console.log(this.consultaDataSource);
            this.obtenerColumnas();
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

  /*
  obtenerConsulta(idConsulta: number) {
    this._consultaService.obtenerConsultaxId(idConsulta).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.consulta = new MatTableDataSource<Consulta>([response.data]);
          this.consultaDataSource = this.consulta.data[0];
          this.hayConsulta = true;
          console.log("DATASOURCE:");
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
  */
  obtenerColumnas() {
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
  }
}
