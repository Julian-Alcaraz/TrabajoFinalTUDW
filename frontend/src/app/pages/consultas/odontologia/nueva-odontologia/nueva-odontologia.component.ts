import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarSoloNumeros } from '../../../../utils/validadores';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ConsultaService } from '../../../../services/consulta.service';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';
import { InputNumberComponent } from '../../../../components/inputs/input-number.component';
import { InputCheckboxComponent } from '../../../../components/inputs/input-checkbox.component';
import { InputSelectComponent } from '../../../../components/inputs/input-select.component';
import { InputTextareaComponent } from '../../../../components/inputs/input-textarea.component';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputSelectEnumComponent } from '../../../../components/inputs/input-select-enum.component';
import { Chico } from '../../../../models/chico.model';

@Component({
  selector: 'app-nueva-odontologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CamposComunesComponent, InputTextComponent, InputNumberComponent, InputCheckboxComponent, InputSelectComponent, InputTextareaComponent, InputSelectEnumComponent],
  templateUrl: './nueva-odontologia.component.html',
  styleUrl: './nueva-odontologia.component.css',
})
export class NuevaOdontologiaComponent {
  public odontologiaForm: FormGroup;
  public chico: Chico | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.odontologiaForm = this.fb.group({
      // Campos comunes
      observaciones: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet justo ut posuere faucibus. Donec augue nisi, mollis et consequat nec, dignissim in ipsum. Phasellus auctor metus at leo tristique pretium. Nulla lacus magna, scelerisque pulvinar lacus ac, blandit lacinia tellus. Mauris mattis diam nec ullamcorper lobortis. Proin ut velit finibus, sagittis odio at, gravida dui. Maecenas malesuada ultrices lectus malesuada ullamcorper. Praesent massa libero, maximus at urna hendrerit, iaculis malesuada velit. Nunc odio quam, suscipit a feugiat vel, viverra sed nisi. Curabitur eleifend sapien eu lacus euismod vestibulum. Integer volutpat, leo at laoreet euismod, purus odio hendrerit velit, vitae viverra magna magna eu nulla. Quisque eget ex vitae elit tristique facilisis nec ac arcu. Mauris ut leo sem. ', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos odontologia
      primera_vez: ['', [Validators.required]],
      ulterior: ['', [Validators.required]],
      cepillo: [true, [Validators.required]],
      cepillado: [true, [Validators.required]],
      topificacion: [false, [Validators.required]],
      derivacion_externa: ['', [Validators.required]],
      dientes_permanentes: [10, [Validators.required, ValidarSoloNumeros]],
      dientes_temporales: [2, [Validators.required, ValidarSoloNumeros]],
      sellador: [1, [Validators.required, ValidarSoloNumeros]],
      dientes_recuperables: [1, [Validators.required, ValidarSoloNumeros]],
      dientes_irecuperables: [2, [Validators.required, ValidarSoloNumeros]],
      habitos: ['Buen cepillado', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      // situacion_bucal: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
  }

  recibirChico(chicoRecibido: Chico | null) {
    this.chico = chicoRecibido;
    if (this.chico) this.esPrimeraVez(this.chico.id);
  }

  esPrimeraVez(id: number) {
    this._consultaService.esPrimeraVez(id, 'Odontologia').subscribe({
      next: (response: any) => {
        if (response.success) {
          this.odontologiaForm.get('primera_vez')?.setValue(response.data.primera_vez);
          this.odontologiaForm.get('ulterior')?.setValue(!response.data.primera_vez);
        }
      },
      error: (err) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
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
    if (this.odontologiaForm.valid || 1 + 1 == 2) {
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
          formValues.cepillado = formValues.cepillado === 'true';
          formValues.cepillo = formValues.cepillo === 'true';
          formValues.topificacion = formValues.topificacion === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            externa: formValues.derivacion_externa === 'true',
          };
          delete formValues.derivacion_externa;
          const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, ...odontologicaValues } = formValues;
          const data = {
            type: 'Odontologia',
            turno,
            obra_social,
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: id_chico,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            ...(derivaciones.externa && { derivaciones }),
            odontologia: {
              ...odontologicaValues,
            },
          };
          console.log('DERIVACIONES: ' + derivaciones);
          console.log('DATA:');
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

  clasificacionDental(dR: number, dIr: number) {
    if (dR == 0 && dIr == 0) return 'Boca sana';
    else if (dR <= 4 && dIr == 0) return 'Bajo índice de caries';
    else if (dIr == 1) return 'Moderado índice de caries';
    else if (dIr > 1) return 'Alto índice de caries';
    else return 'Sin clasificación';
  }
}

/* FORMULARIO LIMPIO
  // Campos comunes
  observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
  // Campos odontologia
  primera_vez: ['', [Validators.required]],
  ulterior: ['', [Validators.required]],
  cepillo: ['', [Validators.required]],
  cepillado: ['', [Validators.required]],
  topificacion: ['', [Validators.required]],
  derivacion_externa: ['', [Validators.required]],
  dientes_permanentes: ['', [Validators.required, ValidarSoloNumeros]],
  dientes_temporales: ['', [Validators.required, ValidarSoloNumeros]],
  sellador: ['', [Validators.required, ValidarSoloNumeros]],
  dientes_recuperables: ['', [Validators.required, ValidarSoloNumeros]],
  dientes_irecuperables: ['', [Validators.required, ValidarSoloNumeros]],
  // situacion_bucal: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
  habitos: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
*/
