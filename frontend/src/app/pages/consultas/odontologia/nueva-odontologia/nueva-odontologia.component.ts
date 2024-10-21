import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ConsultaService } from '../../../../services/consulta.service';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { InputNumberComponent } from '../../components/input-number/input-number.component';
import { InputCheckboxComponent } from '../../components/input-checkbox/input-checkbox.component';
import { InputSelectComponent } from '../../components/input-select/input-select.component';
import { InputTextareaComponent } from '../../components/input-textarea/input-textarea.component';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';

@Component({
  selector: 'app-nueva-odontologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextComponent, InputNumberComponent, InputCheckboxComponent, InputSelectComponent, InputTextareaComponent, CamposComunesComponent],
  templateUrl: './nueva-odontologia.component.html',
  styleUrl: './nueva-odontologia.component.css',
})
export class NuevaOdontologiaComponent {
  public odontologiaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.odontologiaForm = this.fb.group({
      // Campos comunes

      type: ['Odontologia', [Validators.required, ValidarSoloLetras]],
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
      // Campos odontologia
      
      primera_vez: ['', [Validators.required]],
      ulterior: ['', [Validators.required]],
      cepillo: ['', [Validators.required]],
      cepillado: ['', [Validators.required]],
      topificacion: ['', [Validators.required]],
      derivacion: ['', [Validators.required]],
      dientes_permanentes: [1, [Validators.required, ValidarSoloNumeros]],
      dientes_temporales: [1, [Validators.required, ValidarSoloNumeros]],
      sellador: [1, [Validators.required, ValidarSoloNumeros]],
      dientes_recuperables: [1, [Validators.required, ValidarSoloNumeros]],
      dientes_norecuperables: [1, [Validators.required, ValidarSoloNumeros]],
      situacion_bucal: ['Buena', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      habitos: ['Buena', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.odontologiaForm.get(input) as FormControl;
  }

  onChangeCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.checked;
    const controlName = checkbox.id;
    this.odontologiaForm.get(controlName)?.setValue(value);
  }

  enviarFormulario() {
    console.log('FORMULARIO VALIDO:', this.odontologiaForm.valid);
    // console.log(this.odontologiaForm.value);
    if (this.odontologiaForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta odontologica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const formValues = this.odontologiaForm.value;
          delete formValues.dni;
          formValues.primera_vez = formValues.primera_vez === 'true';
          formValues.cepillado = formValues.cepillado === 'true';
          formValues.cepillo = formValues.cepillo === 'true';
          formValues.ulterior = formValues.ulterior === 'true';
          formValues.topificacion = formValues.topificacion === 'true';
          formValues.derivacion = formValues.derivacion === 'true';
          const { type, turno, edad, obra_social, observaciones, id_institucion, id_curso, chicoParam, ...odontologicaValues } = formValues;
          const data = {
            type,
            turno,
            ...(obra_social && { obra_social }),
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: chicoParam.id,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            odontologia: {
              ...odontologicaValues,
            },
          };
          console.log(data);
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.odontologiaForm.reset();
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
