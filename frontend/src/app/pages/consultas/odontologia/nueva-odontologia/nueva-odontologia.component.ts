import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidarCadenaSinEspacios, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
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
      type: ['Odontologia', [Validators.required, ValidarSoloLetras]],
      primera_vez: [false, [Validators.required]],
      ulterior: [false, [Validators.required]],
      cepillo: [false, [Validators.required]],
      cepillado: [false, [Validators.required]],
      topificacion: [false, [Validators.required]],
      derivacion: [false, [Validators.required]],
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
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('FORMULARIO VALIDO:', this.odontologiaForm.valid);
    // console.log(this.odontologiaForm.value);
    /*
    console.log('- - - - - - - - Valores Generales - - - - - - - -');
    console.log('# 1 Valor de obra_social:', this.odontologiaForm.get('obra_social')?.value);
    console.log('# 2 Valor de edad:', this.odontologiaForm.get('edad')?.value);
    console.log('# 3 Valor de observaciones:', this.odontologiaForm.get('observaciones')?.value);
    console.log('# 4 Valor de dni:', this.odontologiaForm.get('dni')?.value);
    console.log('- - - - - - - - Valores Odontología - - - - - - - -');
    console.log('# 5 Valor de primera_vez:', this.odontologiaForm.get('primera_vez')?.value);
    console.log('# 6 Valor de ulterior:', this.odontologiaForm.get('ulterior')?.value);
    console.log('# 7 Valor de cepillo:', this.odontologiaForm.get('cepillo')?.value);
    console.log('# 8 Valor de dientes_permanentes:', this.odontologiaForm.get('dientes_permanentes')?.value);
    console.log('# 9 Valor de dientes_temporales:', this.odontologiaForm.get('dientes_temporales')?.value);
    console.log('# 10 Valor de sellador:', this.odontologiaForm.get('sellador')?.value);
    console.log('# 11 Valor de topificacion:', this.odontologiaForm.get('topificacion')?.value);
    console.log('# 12 Valor de cepillado:', this.odontologiaForm.get('cepillado')?.value);
    console.log('# 13 Valor de derivacion:', this.odontologiaForm.get('derivacion')?.value);
    console.log('# 14 Valor de dientes_recuperables:', this.odontologiaForm.get('dientes_recuperables')?.value);
    console.log('# 15 Valor de dientes_norecuperables:', this.odontologiaForm.get('dientes_norecuperables')?.value);
    console.log('# 16 Valor de situacion_bucal:', this.odontologiaForm.get('situacion_bucal')?.value);
    console.log('# 17 Valor de habitos:', this.odontologiaForm.get('habitos')?.value);
    console.log('- - - - - - - - Relaciones - - - - - - - -');
    console.log('# 1 ChicoParam: ', this.odontologiaForm.get('chicoParam')?.value);
    console.log('# 2 Valor de id_institucion:', this.odontologiaForm.get('id_institucion')?.value);
    console.log('# 3 Valor de id_curso:', this.odontologiaForm.get('id_curso')?.value);
    console.log('- - - - - - - - Errores Generales - - - - - - - -');
    console.log('# 1 Errores en dni:', this.odontologiaForm.get('dni')?.errors);
    console.log('# 2 Errores en edad:', this.odontologiaForm.get('edad')?.errors);
    console.log('# 3 Errores en obra_social:', this.odontologiaForm.get('obra_social')?.errors);
    console.log('# 4 Errores en observaciones:', this.odontologiaForm.get('observaciones')?.errors);
    console.log('- - - - - - - - Errores Odontología - - - - - - - -');
    console.log('# 5 Errores en primera_vez:', this.odontologiaForm.get('primera_vez')?.errors);
    console.log('# 6 Errores en ulterior:', this.odontologiaForm.get('ulterior')?.errors);
    console.log('# 7 Errores en cepillo:', this.odontologiaForm.get('cepillo')?.errors);
    console.log('# 8 Errores en dientes_permanentes:', this.odontologiaForm.get('dientes_permanentes')?.errors);
    console.log('# 9 Errores en dientes_temporales:', this.odontologiaForm.get('dientes_temporales')?.errors);
    console.log('# 10 Errores en sellador:', this.odontologiaForm.get('sellador')?.errors);
    console.log('# 11 Errores en topificacion:', this.odontologiaForm.get('topificacion')?.errors);
    console.log('# 12 Errores en cepillado:', this.odontologiaForm.get('cepillado')?.errors);
    console.log('# 13 Errores en derivacion:', this.odontologiaForm.get('derivacion')?.errors);
    console.log('# 14 Errores en dientes_recuperables:', this.odontologiaForm.get('dientes_recuperables')?.errors);
    console.log('# 15 Errores en dientes_norecuperables:', this.odontologiaForm.get('dientes_norecuperables')?.errors);
    console.log('# 16 Errores en clasificacion:', this.odontologiaForm.get('clasificacion')?.errors);
    console.log('# 17 Errores en situacion_bucal:', this.odontologiaForm.get('situacion_bucal')?.errors);
    console.log('# 18 Errores en habitos:', this.odontologiaForm.get('habitos')?.errors);
    */
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
          const { type, edad, obra_social, observaciones, id_institucion, id_curso, chicoParam, ...odontologicaValues } = formValues;
          const data = {
            type,
            ...(obra_social && { obra_social }),
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            chicoId: chicoParam.id,
            institucionId: parseInt(id_institucion),
            cursoId: parseInt(id_curso),
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
