import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarNumerosFloat } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputNumberComponent } from '../../../../components/inputs/input-number.component';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';
import { InputCheckboxComponent } from '../../../../components/inputs/input-checkbox.component';
import { InputSelectComponent } from '../../../../components/inputs/input-select.component';
import { InputTextareaComponent } from '../../../../components/inputs/input-textarea.component';
import { InputSelectEnumComponent } from '../../../../components/inputs/input-select-enum.component';

// ACA FALTARIA AGREGAR ENUMS SI SE CONFIRMARON CON LA FUNDACION

@Component({
  selector: 'app-nueva-clinica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CamposComunesComponent, InputNumberComponent, InputTextComponent, InputCheckboxComponent, InputSelectComponent, InputTextareaComponent, InputSelectEnumComponent],
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
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos Medica Clinica
      peso: [45, [Validators.required, ValidarNumerosFloat]],
      diabetes: [true, [Validators.required]],
      hta: [false, [Validators.required]],
      obesidad: [true, [Validators.required]],
      consumo_alcohol: [false, [Validators.required]],
      consumo_drogas: [false, [Validators.required]],
      consumo_tabaco: [true, [Validators.required]],
      antecedentes_perinatal: [false, [Validators.required]],
      enfermedades_previas: [true, [Validators.required]],
      vacunas: ['Completo', [Validators.required]],
      talla: [170, [Validators.required, ValidarNumerosFloat]],
      cc: [40, [Validators.required, ValidarNumerosFloat]],
      tas: [70, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
      tad: [120, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
      examen_visual: ['Normal', [Validators.required]],
      ortopedia_traumatologia: ['Normal', [Validators.required]],
      lenguaje: ['Adecuado', [Validators.required]],
      segto: [true, [Validators.required]],
      leche: [true, [Validators.required]],
      infusiones: ['Té', [Validators.required]],
      cantidad_comidas: ['4', [Validators.required]],
      alimentacion: ['Frituras', [Validators.required]],
      hidratacion: ['Agua', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      horas_pantalla: ['Menor a 2hs', [Validators.required]],
      horas_juego_aire_libre: ['Menos de 1h', [Validators.required]],
      horas_suenio: ['Menos de 10hs', [Validators.required]],
      derivacion_fonoaudiologia: [false, [Validators.required]],
      derivacion_oftalmologia: [false, [Validators.required]],
      derivacion_odontologia: [false, [Validators.required]],
      derivacion_externa: [false, [Validators.required]],
      // proyecto: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      // Ver maximos y minimos de estos valores:
      pcta: [70, [Validators.required, ValidarNumerosFloat]],
      pcimc: [90, [Validators.required, ValidarNumerosFloat]],
      pct: [85, [Validators.required, ValidarNumerosFloat]],
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
    console.log('FORMULARIO VALIDO:', this.clinicaForm.valid);
    this.verErroresFormulario();
    // console.log(this.clinicaForm.value);
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
          formValues.leche = formValues.leche === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          delete formValues.dni;

          const derivacionesSinFiltrar = {
            Odontologia: formValues.derivacion_odontologia,
            Oftalmologia: formValues.derivacion_oftalmologia,
            Fonoaudiologia: formValues.derivacion_fonoaudiologia,
            Externa: formValues.derivacion_externa,
          };

          const derivaciones = Object.fromEntries(Object.entries(derivacionesSinFiltrar).filter(([, value]) => value === true));

          if (Object.keys(derivaciones).length === 0 && derivaciones.constructor === Object) {
            // si pasa esto no hay derivaciones
            console.log('no hay derivaciones');
          }

          delete formValues.derivacion_externa;
          delete formValues.derivacion_fonoaudiologia;
          delete formValues.derivacion_odontologia;
          delete formValues.derivacion_oftalmologia;

          const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, ...clinicaValues } = formValues;
          const data = {
            type: 'Clinica',
            turno,
            obra_social,
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: id_chico,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            derivaciones,
            clinica: {
              ...clinicaValues,
            },
          };
          console.log('DATA:');
          console.log(data);
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

  calcularImc(peso: number, talla: number) {
    return peso / ((talla / 100) * (talla / 100));
  }

  calcularEstadoNutricional(pcimc: number) {
    if (pcimc < 4) return 'B Bajo peso/Desnutrido';
    if (pcimc >= 4 && pcimc < 10) return 'A Riesgo Nutricional';
    if (pcimc >= 10 && pcimc < 85) return 'C Eutrófico';
    if (pcimc >= 85 && pcimc < 95) return 'D Sobrepeso';
    if (pcimc >= 95) return 'E Obesidad';
    else return 'Sin clasificacion';
  }

  calcularTensionArterial(pcta: number) {
    if (pcta < 90) return 'Normotenso';
    if (pcta >= 90 && pcta < 95) return 'Riesgo';
    if (pcta >= 95) return 'Hipertenso';
    else return 'Sin clasificacion';
  }
}

// FORMULARIO LIMPIO:
/*
      // Campos comunes
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos Medica Clinica
      peso: ['', [Validators.required, ValidarNumerosFloat]],
      diabetes: [false, [Validators.required]],
      hta: [false, [Validators.required]],
      obesidad: [false, [Validators.required]],
      consumo_alcohol: [false, [Validators.required]],
      consumo_drogas: [false, [Validators.required]],
      consumo_tabaco: [false, [Validators.required]],
      antecedentes_perinatal: [false, [Validators.required]],
      enfermedades_previas: [false, [Validators.required]],
      vacunas: ['', [Validators.required]],
      talla: ['', [Validators.required, ValidarNumerosFloat]],
      cc: ['', [Validators.required, ValidarNumerosFloat]],
      tas: ['', [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
      tad: ['', [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
      examen_visual: ['', [Validators.required]],
      ortopedia_traumatologia: ['', [Validators.required]],
      lenguaje: ['', [Validators.required]],
      segto: [false, [Validators.required]],
      leche: ['', [Validators.required]],
      infusiones: ['', [Validators.required]],
      cantidad_comidas: ['', [Validators.required]],
      alimentacion: ['', [Validators.required]],
      hidratacion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      horas_pantalla: ['', [Validators.required]],
      horas_juego_aire_libre: ['', [Validators.required]],
      horas_suenio: ['', [Validators.required]],
      derivacion_fonoaudiologia: [false, [Validators.required]],
      derivacion_oftalmologia: [false, [Validators.required]],
      derivacion_odontologia: [false, [Validators.required]],
      derivacion_externa: [false, [Validators.required]],
      // proyecto: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      // Ver maximos y minimos de estos valores:
      pcta: ['', [Validators.required, ValidarNumerosFloat]],
      pcimc: ['', [Validators.required, ValidarNumerosFloat]],
      pct: ['', [Validators.required, ValidarNumerosFloat]],
*/
