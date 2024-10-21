import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarHora, ValidarNumerosFloat, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputNumberComponent } from '../../components/input-number/input-number.component';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { InputCheckboxComponent } from '../../components/input-checkbox/input-checkbox.component';
import { InputSelectComponent } from '../../components/input-select/input-select.component';
import { InputTextareaComponent } from '../../components/input-textarea/input-textarea.component';

@Component({
  selector: 'app-nueva-clinica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CamposComunesComponent, InputNumberComponent, InputTextComponent, InputCheckboxComponent, InputSelectComponent, InputTextareaComponent],
  templateUrl: './nueva-clinica.component.html',
  styleUrl: './nueva-clinica.component.css',
})

export class NuevaClinicaComponent {
  public clinicaForm: FormGroup;
  public opcionesVacunas: string[] = ['Completo', 'Incompleto', 'Se desconoce'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.clinicaForm = this.fb.group({
      // Campos comunes

      type: ['Clinica', [Validators.required, ValidarSoloLetras]],
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
      // Campos Medica Clinica

      peso: [45.1, [Validators.required, ValidarNumerosFloat]],
      diabetes: [false, [Validators.required]],
      hta: [false, [Validators.required]],
      obesidad: [false, [Validators.required]],
      consumo_alcohol: [false, [Validators.required]],
      consumo_drogas: [false, [Validators.required]],
      antecedentes_perinatal: [false, [Validators.required]],
      enfermedades_previas: [false, [Validators.required]],
      vacunas: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      // vacunas: ["", [Validators.required, ValidarCadenaSinEspacios]] AGREGAR ENUM SI LO HAGO DE FORMA DE SELECT
      talla: [1.11, [Validators.required, ValidarNumerosFloat]],
      cc: [2.22, [Validators.required, ValidarNumerosFloat]],
      tas: [120.7, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
      tad: [70.2, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
      examen_visual: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      ortopedia_traumatologia: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      lenguaje: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      segto: [false, [Validators.required]],
      lacteos: [false, [Validators.required]],
      infusiones: [false, [Validators.required]],
      numero_comidas: [4, [Validators.required, ValidarSoloNumeros]],
      alimentacion: ['Buena', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      hidratacion: ['Buena', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      horas_pantalla: ['01:28', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarCadenaSinEspacios, ValidarHora]],
      horas_juego_airelibre: ['00:01', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarCadenaSinEspacios, ValidarHora]],
      horas_suenio: ['23:59', [Validators.required, Validators.minLength(1), Validators.maxLength(5), ValidarCadenaSinEspacios, ValidarHora]],
      proyecto: ['Control Niño Sano', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      // Usar ValidarNumerosFloat? y ver maximos y minimos de estos valores:
      pcta: [7, [Validators.required, ValidarSoloNumeros]],
      pcimc: [2, [Validators.required, ValidarSoloNumeros]],
      pct: [4, [Validators.required, ValidarSoloNumeros]],
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.clinicaForm.get(input) as FormControl;
  }

  onChangeCheckbox(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.checked;
    const controlName = checkbox.id;
    this.clinicaForm.get(controlName)?.setValue(value);
  }

  verErroresFormulario() {
    const formErrors: any = {};
    Object.keys(this.clinicaForm.controls).forEach((controlName) => {
      const control = this.clinicaForm.get(controlName);
      if (control && control.errors) {
        formErrors[controlName] = control.errors;
      }
    });
    console.log('Errores del formulario:', formErrors);
    return formErrors;
  }

  enviarFormulario() {
    // console.log('FORMULARIO VALIDO:', this.clinicaForm.valid);
    // this.verErroresFormulario();
    // console.log(this.clinicaForm.value);
    // console.log(this.clinicaForm.value.turno);
    if (this.clinicaForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta medica clinica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          console.log(this.clinicaForm.value);
          const formValues = this.clinicaForm.value;
          formValues.segto = formValues.segto === 'true';
          delete formValues.dni;
          const { type, turno, edad, obra_social, observaciones, id_institucion, id_curso, chicoParam, ...clinicaValues } = formValues;
          const data = {
            type,
            turno,
            ...(obra_social && { obra_social }),
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: chicoParam.id,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            clinica: {
              ...clinicaValues,
            },
          };
          // console.log(data);
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.clinicaForm.reset();
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