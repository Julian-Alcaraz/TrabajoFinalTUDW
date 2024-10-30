import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TitleCasePipe } from '@angular/common';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ConsultaService } from '../../../../services/consulta.service';
import { DataConsultaPipe } from '../../../../utils/pipes/data-consulta.pipe';
import { KeyDataConsultaPipe } from '../../../../utils/pipes/key-data-consulta.pipe';

@Component({
  selector: 'app-detalles-consulta',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, DataConsultaPipe, KeyDataConsultaPipe, TitleCasePipe],
  templateUrl: './detalles-consulta.component.html',
  styleUrl: './detalles-consulta.component.css',
})
export class DetallesConsultaComponent implements OnInit, OnChanges {
  @Input() idConsulta: number | null = null;

  public consultaColumns: string[] = [];
  public hayConsulta = false;
  public consulta: any;
  public datosTipoConsulta: any;
  public usuarioCreador: any;
  public institucion: any;
  public curso: any;

  constructor(
    private _consultaService: ConsultaService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    if (this.idConsulta) {
      this._consultaService.obtenerConsultaxId(this.idConsulta).subscribe({
        next: async (response: any) => {
          if (response.success) {
            this.hayConsulta = true;
            this.convertirData(response.data);
          } else {
            this.hayConsulta = false;
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
          if (response.success) {
            this.hayConsulta = true;
            this.convertirData(response.data);
          } else {
            this.hayConsulta = false;
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
  convertirData(consultaDataSource: any) {
    const { usuario, institucion, curso, consultaHija, ...consulta } = consultaDataSource;
    this.datosTipoConsulta = consultaHija;

    delete usuario.id;
    delete usuario.updated_at;
    delete usuario.created_at;
    delete usuario.deshabilitado;
    delete usuario.contrasenia;
    this.usuarioCreador = usuario;

    delete institucion.id;
    delete institucion.updated_at;
    delete institucion.created_at;
    delete institucion.deshabilitado;
    this.institucion = institucion;

    delete curso.id;
    delete curso.updated_at;
    delete curso.created_at;
    delete curso.deshabilitado;
    this.curso = curso;

    delete consulta.updated_at;
    delete consulta.deshabilitado;
    delete consulta.id;

    this.consulta = consulta;
  }
}
