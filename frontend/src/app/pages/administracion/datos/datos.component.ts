import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProcesamientoService } from '@app/services/procesamiento.service';
import { mensajeErrorServicio } from '@app/utils/notificaciones/mostrar-notificacion';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { SelectFileComponent } from './select-file/select-file.component';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectFileComponent],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css',
})
export class DatosComponent {
  clinicaFileControl: FormControl = new FormControl('', [Validators.required]);
  fonoaudiologiaFileControl: FormControl = new FormControl('', [Validators.required]);
  odontologiaFileControl: FormControl = new FormControl('', [Validators.required]);
  oftalmologiaFileControl: FormControl = new FormControl('', [Validators.required]);
  prevencionFileControl: FormControl = new FormControl('', [Validators.required]);
  socialFileControl: FormControl = new FormControl('', [Validators.required]);
  talleresFileControl: FormControl = new FormControl('', [Validators.required]);
  loading = false;
  ultimoArchivo: File | null = null;
  controls: Record<string, FormControl> = {
    clinica: this.clinicaFileControl,
    fonoaudiologia: this.fonoaudiologiaFileControl,
    odontologia: this.odontologiaFileControl,
    oftalmologia: this.oftalmologiaFileControl,
    prevencion: this.prevencionFileControl,
    social: this.socialFileControl,
    talleres: this.talleresFileControl,
  };
  formData: FormData = new FormData();
  fileName = '';

  constructor(
    private _procesamientoService: ProcesamientoService,
    private snackBar: MatSnackBar,
  ) {}

  updateFormData() {
    if (this.ultimoArchivo) {
      this.formData.set('archivo', this.ultimoArchivo, this.ultimoArchivo.name);
    }
  }

  onFileSelected(event: any) {
    const idChange: string = event.target.id;
    this.limpiarControladores(idChange);
    this.ultimoArchivo = event.target.files[0];
    this.updateFormData();
  }

  limpiarControladores(changedId: string) {
    const controls = ['clinica', 'fonoaudiologia', 'odontologia', 'oftalmologia', 'prevencion', 'social', 'talleres'];
    controls.forEach((control) => {
      if (control !== changedId) {
        this.controls[control].setValue(null);
      }
    });
  }

  controlResponse = {
    next: (response: any) => {
      Swal.fire({
        title: 'El proceso termino.',
        text: `Hay ${response.data.length} filas no cargadas`,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Descargar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.exportar(response.data);
        }
      });
      this.loading = false;
    },
    error: (err: any) => {
      console.log(err);
      mensajeErrorServicio(this.snackBar, err);
      this.loading = false;
    },
  };

  exportar(data: any) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
  }

  cargarArchivo(event: any) {
    this.fileName = event + 'Errores';
    switch (event) {
      case 'Clinica':
        this._procesamientoService.procesarClinica(this.formData).subscribe(this.controlResponse);
        break;
      case 'Fonoaudiologia':
        this._procesamientoService.procesarFonoaudiologia(this.formData).subscribe(this.controlResponse);
        break;
      case 'Odontologia':
        this._procesamientoService.procesarOdontologia(this.formData).subscribe(this.controlResponse);
        break;
      case 'Oftalmologia':
        this._procesamientoService.procesarOftalmologia(this.formData).subscribe(this.controlResponse);
        break;
      case 'Prevencion':
        this._procesamientoService.procesarPrevencion(this.formData).subscribe(this.controlResponse);
        break;
      case 'Social':
        this._procesamientoService.procesarSocial(this.formData).subscribe(this.controlResponse);
        break;
      case 'Talleres':
        this._procesamientoService.procesarTalleres(this.formData).subscribe(this.controlResponse);
        break;
      default:
        console.log('Tipo de evento no reconocido:', event.type);
        break;
    }
  }
}
