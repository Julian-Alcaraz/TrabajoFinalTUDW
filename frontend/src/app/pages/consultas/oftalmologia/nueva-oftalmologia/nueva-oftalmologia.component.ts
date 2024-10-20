import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarSoloLetras } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { InputCheckboxComponent } from '../../components/input-checkbox/input-checkbox.component';

@Component({
  selector: 'app-nueva-oftalmologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, CamposComunesComponent, InputTextComponent, InputCheckboxComponent],
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
      type: ['Oftalmologia', [Validators.required, ValidarSoloLetras]],
      demanda: ['Padre', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      primera_vez: [false, [Validators.required]],
      control: [false, [Validators.required]],
      receta: [false, [Validators.required]],
      anteojos: [false, [Validators.required]],
      prox_control: [this.fechaManana, Validators.required],
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
    /*
    console.log('- - - - - - - - Valores Generales - - - - - - - -');
    console.log('# 1 Valor de obra_social:', this.oftalmologiaForm.get('obra_social')?.value);
    console.log('# 2 Valor de edad:', this.oftalmologiaForm.get('edad')?.value);
    console.log('# 3 Valor de observaciones:', this.oftalmologiaForm.get('observaciones')?.value);
    console.log('# 4 Valor de dni:', this.oftalmologiaForm.get('dni')?.value);
    console.log('- - - - - - - - Valores Oftalmologia - - - - - - - -');
    console.log('Agregarlos...');
    console.log('- - - - - - - - Relaciones - - - - - - - -');
    console.log('# 36 ChicoParam: ', this.oftalmologiaForm.get('chicoParam')?.value);
    console.log('# 37 Valor de id_institucion:', this.oftalmologiaForm.get('id_institucion')?.value);
    console.log('# 38 Valor de id_curso:', this.oftalmologiaForm.get('id_curso')?.value);
    console.log('- - - - - - - - Errores Generales - - - - - - - -');
    console.log('# 1 Errores en dni:', this.oftalmologiaForm.get('dni')?.errors);
    console.log('# 2 Errores en edad:', this.oftalmologiaForm.get('edad')?.errors);
    console.log('# 3 Errores en obra_social:', this.oftalmologiaForm.get('obra_social')?.errors);
    console.log('# 4 Errores en observaciones:', this.oftalmologiaForm.get('observaciones')?.errors);
    console.log('- - - - - - - - Errores Odontología - - - - - - - -');
    */
    console.log('Agregarlos...');
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
          const { type, edad, obra_social, observaciones, id_institucion, id_curso, chicoParam, ...oftalmologiaValues } = formValues;
          const data = {
            type,
            ...(obra_social && { obra_social }),
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            chicoId: chicoParam.id,
            institucionId: parseInt(id_institucion),
            cursoId: parseInt(id_curso),
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
