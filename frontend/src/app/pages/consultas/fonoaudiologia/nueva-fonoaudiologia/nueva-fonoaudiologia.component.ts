import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarSoloLetras } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { InputCheckboxComponent } from '../../components/input-checkbox/input-checkbox.component';
import { InputTextareaComponent } from '../../components/input-textarea/input-textarea.component';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';

@Component({
  selector: 'app-nueva-fonoaudiologia',
  standalone: true,
  imports: [ReactiveFormsModule, CamposComunesComponent, InputTextComponent, InputCheckboxComponent, InputTextareaComponent],
  templateUrl: './nueva-fonoaudiologia.component.html',
  styleUrl: './nueva-fonoaudiologia.component.css',
})
export class NuevaFonoaudiologicaComponent {
  public fonoaudiologiaForm: FormGroup;
  public fechaManana = new Date(new Date().setDate(new Date().getDate() + 1));

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.fonoaudiologiaForm = this.fb.group({
      // Campos comunes

      type: ['Fonoaudiologia', [Validators.required, ValidarSoloLetras]],
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],

      // Campos Fonoaudiologica
      diagnosticoPresuntivo: ['', [Validators.required, ValidarSoloLetras, ValidarCadenaSinEspacios, Validators.minLength(1), Validators.maxLength(100)]],
      causas: ['', [Validators.required, ValidarSoloLetras, ValidarCadenaSinEspacios, Validators.minLength(1), Validators.maxLength(100)]],
      asistencia: [false, [Validators.required]],
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.fonoaudiologiaForm.get(input) as FormControl;
  }

  onChangeCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.checked;
    const controlName = checkbox.id;
    this.fonoaudiologiaForm.get(controlName)?.setValue(value);
  }

  enviarFormulario() {
    if (this.fonoaudiologiaForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta oftalmologica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const formValues = this.fonoaudiologiaForm.value;
          delete formValues.dni;
          const { type, turno, edad, obra_social, observaciones, id_institucion, id_curso, chicoParam, ...fonoaudiologiaValues } = formValues;
          const data = {
            type,
            turno,
            ...(obra_social && { obra_social }),
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: chicoParam.id,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            fonoaudiologia: {
              ...fonoaudiologiaValues,
            },
          };
          console.log(data);
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.fonoaudiologiaForm.reset();
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
