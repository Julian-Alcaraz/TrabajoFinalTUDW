import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';
import { InputCheckboxComponent } from '../../../../components/inputs/input-checkbox.component';
import { InputTextareaComponent } from '../../../../components/inputs/input-textarea.component';
import { InputSelectEnumComponent } from '../../../../components/inputs/input-select-enum.component';
import { InputDateComponent } from '../../../../components/inputs/input-date.component';
import { Chico } from '../../../../models/chico.model';

@Component({
  selector: 'app-nueva-oftalmologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, CamposComunesComponent, InputTextComponent, InputCheckboxComponent, InputTextareaComponent, InputSelectEnumComponent, InputDateComponent],
  templateUrl: './nueva-oftalmologia.component.html',
  styleUrl: './nueva-oftalmologia.component.css',
})
export class NuevaOftalmologiaComponent {
  public oftalmologiaForm: FormGroup;
  public fechaManana = new Date(new Date().setDate(new Date().getDate() + 1));
  public chico: Chico | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.oftalmologiaForm = this.fb.group({
      // Campos comunes
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos Oftalmologia
      demanda: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      primera_vez: ['', [Validators.required]],
      control: ['', [Validators.required]],
      receta: ['', [Validators.required]],
      anteojos: [''],
      prox_control: ['', Validators.required],
      derivacion_externa: ['', [Validators.required]],
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.oftalmologiaForm.get(input) as FormControl;
  }

  recibirChico(chicoRecibido: Chico | null) {
    this.chico = chicoRecibido;
    if (this.chico) this.esPrimeraVez(this.chico.id);
  }

  esPrimeraVez(id: number) {
    this._consultaService.esPrimeraVez(id, 'Oftalmologia').subscribe({
      next: (response: any) => {
        if (response.success) {
          const primeraVez = response.data.primera_vez;
          this.oftalmologiaForm.get('primera_vez')?.setValue(primeraVez);
          this.oftalmologiaForm.get('control')?.setValue(!primeraVez);

          const anteojosControl = this.oftalmologiaForm.get('anteojos');
          if (primeraVez) {
            anteojosControl?.clearValidators();
            anteojosControl?.setValue(null);
          } else {
            anteojosControl?.setValidators([Validators.required]);
          }
          anteojosControl?.updateValueAndValidity();
          console.log('VALOR ANTEOJOS:');
          console.log(anteojosControl?.value);
        }
      },
      error: (err) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  onChangeCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.checked;
    const controlName = checkbox.id;
    this.oftalmologiaForm.get(controlName)?.setValue(value);
  }

  enviarFormulario() {
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
          formValues.primera_vez = formValues.primera_vez === 'true';
          formValues.control = formValues.control === 'true';
          formValues.receta = formValues.receta === 'true';
          if (formValues.anteojos !== null) formValues.anteojos = formValues.anteojos === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            externa: formValues.derivacion_externa === 'true',
          };
          delete formValues.dni;
          delete formValues.derivacion_externa;
          const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, ...oftalmologiaValues } = formValues;
          const data = {
            type: 'Oftalmologia',
            turno,
            obra_social,
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: id_chico,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            ...(derivaciones.externa && { derivaciones }),
            oftalmologia: {
              ...oftalmologiaValues,
            },
          };
          console.log('DATA:');
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
