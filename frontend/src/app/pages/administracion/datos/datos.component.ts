import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ProcesamientoService } from '@app/services/procesamiento.service';
import { mensajeErrorServicio } from '@app/utils/notificaciones/mostrar-notificacion';
import { InputFileComponent } from '@components/inputs/input-file.component';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [CommonModule, InputFileComponent, FormsModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css',
})
export class DatosComponent {
  clinicaFileControl: FormControl = new FormControl('', [Validators.required]);
  fonoaudiologiaFileControl: FormControl = new FormControl('', [Validators.required]);
  odontologiaFileControl: FormControl = new FormControl('', [Validators.required]);
  oftalmologiaFileControl: FormControl = new FormControl('', [Validators.required]);
  // adiccionFileControl: FormControl = new FormControl('',[Validators.required])
  loading = false;
  ultimoArchivo: File | null = null;
  controls: Record<string, FormControl> = {
    clinica: this.clinicaFileControl,
    fonoaudiologia: this.fonoaudiologiaFileControl,
    odontologia: this.odontologiaFileControl,
    oftalmologia: this.oftalmologiaFileControl,
  };
  formData: FormData = new FormData();
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
    const controls = ['clinica', 'fonoaudiologia', 'odontologia', 'oftalmologia'];
    controls.forEach((control) => {
      if (control !== changedId) {
        console.log('set false', changedId, control);
        this.controls[control].setValue(null);
      }
    });
  }
  controlResponse = {
    next: (response: any) => {
      console.log(response);
      this.loading = false;
    },
    error: (err: any) => {
      console.log(err);
      mensajeErrorServicio(this.snackBar, err);
      this.loading = false;
    },
  };

  cargarArchivoClinica() {
    this.loading = true;
    if (!this.clinicaFileControl.errors) {
      if (this.ultimoArchivo) {
        this._procesamientoService.procesarClinica(this.formData).subscribe(this.controlResponse);
      }
    }
  }
  cargarArchivoOdontologia() {
    this.loading = true;
    if (!this.odontologiaFileControl.errors) {
      if (this.ultimoArchivo) {
        this._procesamientoService.procesarOdontologia(this.formData).subscribe(this.controlResponse);
      }
    }
  }
  cargarArchivoFonoaudiologia() {
    this.loading = true;
    if (!this.fonoaudiologiaFileControl.errors) {
      if (this.ultimoArchivo) {
        this._procesamientoService.procesarFonoaudiologia(this.formData).subscribe(this.controlResponse);
      }
    }
  }
  cargarArchivoOftalmologia() {
    this.loading = true;
    if (!this.oftalmologiaFileControl.errors) {
      if (this.ultimoArchivo) {
        this._procesamientoService.procesarOftalmologia(this.formData).subscribe(this.controlResponse);
      }
    }
  }
}
