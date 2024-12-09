import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsultaService } from '../../services/consulta.service';
import { Consulta } from '../../models/consulta.model';
import { CommonModule } from '@angular/common';
import { NuevaOdontologiaComponent } from '../../pages/consultas/odontologia/nueva-odontologia/nueva-odontologia.component';
import { NuevaClinicaComponent } from '../../pages/consultas/clinica/nueva-clinica/nueva-clinica.component';
import { NuevaFonoaudiologicaComponent } from '../../pages/consultas/fonoaudiologia/nueva-fonoaudiologia/nueva-fonoaudiologia.component';
import { NuevaOftalmologiaComponent } from '../../pages/consultas/oftalmologia/nueva-oftalmologia/nueva-oftalmologia.component';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-ver-consulta',
  standalone: true,
  imports: [CommonModule, NuevaOdontologiaComponent, NuevaClinicaComponent, NuevaFonoaudiologicaComponent, NuevaOftalmologiaComponent],
  templateUrl: './ver-consulta.component.html',
  styleUrl: './ver-consulta.component.css',
})
export class VerConsultaComponent implements OnInit {
  isDialog = false;
  consulta: Consulta | null = null;
  editar = false;
  identidad: any;
  constructor(
    public dialogRef: MatDialogRef<VerConsultaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _consultaService: ConsultaService,
    private _sessionService: SessionService,
  ) {
    this.isDialog = !data;
  }
  ngOnInit() {
    this.obtenerConsulta();
    this.esEditor();
  }
  obtenerConsulta() {
    if (this.data) {
      this._consultaService.obtenerConsultaxId(this.data).subscribe({
        next: (response: any) => {
          this.consulta = response.data;
        },
      });
    }
  }
  esEditor() {
    this.identidad = this._sessionService.getIdentidad();
    // es editar si el id es medico o admin
    if (this.identidad.roles_ids.includes(1) || this.identidad.roles_ids.includes(2)) {
      this.editar = true;
    }
  }
  cerrarModal() {
    this.dialogRef.close(false);
  }

  cerrarModalYrecargarListado(consultaMod: any) {
    this.dialogRef.close(consultaMod)
  }
}
