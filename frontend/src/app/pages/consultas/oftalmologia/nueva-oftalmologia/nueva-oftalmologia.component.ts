import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarSoloLetras } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { InputCheckboxComponent } from '../../components/input-checkbox/input-checkbox.component';
import { InputTextareaComponent } from '../../components/input-textarea/input-textarea.component';

@Component({
  selector: 'app-nueva-oftalmologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, CamposComunesComponent, InputTextComponent, InputCheckboxComponent, InputTextareaComponent],
  templateUrl: './nueva-oftalmologia.component.html',
  styleUrl: './nueva-oftalmologia.component.css',
})
export class NuevaOftalmologiaComponent {
  public oftalmologiaForm: FormGroup;
  public fechaManana = new Date(new Date().setDate(new Date().getDate() + 1));

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.oftalmologiaForm = this.fb.group({
      // Campos comunes
      type: ['Oftalmologia', [Validators.required, ValidarSoloLetras]],
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],

      // Campos Oftalmologia
      demanda: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      primera_vez: ['', [Validators.required]],
      control: ['', [Validators.required]],
      receta: ['', [Validators.required]],
      anteojos: ['', [Validators.required]],
      prox_control: ['', Validators.required],
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.oftalmologiaForm.get(input) as FormControl;
  }

  onChangeCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.checked;
    const controlName = checkbox.id;
    this.oftalmologiaForm.get(controlName)?.setValue(value);
  }

  enviarFormulario() {
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('FORMULARIO VALIDO:', this.oftalmologiaForm.valid);
    if (this.oftalmologiaForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta oftalmologica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const formValues = this.oftalmologiaForm.value;
          delete formValues.dni;
          formValues.primera_vez = formValues.primera_vez === 'true';
          formValues.control = formValues.control === 'true';
          formValues.receta = formValues.receta === 'true';
          formValues.anteojos = formValues.anteojos === 'true';
          const { type, turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, ...oftalmologiaValues } = formValues;
          const data = {
            type,
            turno,
            ...(obra_social && { obra_social }),
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: id_chico,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            oftalmologia: {
              ...oftalmologiaValues,
            },
          };
          console.log(data);
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.oftalmologiaForm.reset();
              }
            },
            error: (err) => {
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
        }
      });
    }
  }
}
