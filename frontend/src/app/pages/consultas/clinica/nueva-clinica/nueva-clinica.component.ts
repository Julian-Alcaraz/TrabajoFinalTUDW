import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarNumerosFloat } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputNumberComponent } from '../../../../components/inputs/input-number.component';
import { InputCheckboxComponent } from '../../../../components/inputs/input-checkbox.component';
import { InputTextareaComponent } from '../../../../components/inputs/input-textarea.component';
import { InputSelectEnumComponent } from '../../../../components/inputs/input-select-enum.component';
import { Consulta } from '../../../../models/consulta.model';
import { DatosMedicoComponent } from '../../components/datos-medico/datos-medico.component';

// ACA FALTARIA AGREGAR ENUMS SI SE CONFIRMARON CON LA FUNDACION

@Component({
  selector: 'app-nueva-clinica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatosMedicoComponent, CamposComunesComponent, InputNumberComponent, InputCheckboxComponent, InputTextareaComponent, InputSelectEnumComponent],
  templateUrl: './nueva-clinica.component.html',
  styleUrl: './nueva-clinica.component.css',
})
export class NuevaClinicaComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Input() editar = true;
  @Output() modificoConsulta = new EventEmitter<any>();
  habilitarModificar = false;

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
      segto: ['', [Validators.required]],
      leche: ['', [Validators.required]],
      infusiones: ['', [Validators.required]],
      cantidad_comidas: ['', [Validators.required]],
      alimentacion: ['', [Validators.required]],
      hidratacion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      horas_pantalla: ['', [Validators.required]],
      horas_juego_aire_libre: ['', [Validators.required]],
      horas_suenio: ['', [Validators.required]],
      derivacion_fonoaudiologia: [false, []],
      derivacion_oftalmologia: [false, []],
      derivacion_odontologia: [false, []],
      derivacion_externa: [false, []],
      pcta: ['', [Validators.required, Validators.min(0), Validators.max(100), ValidarNumerosFloat]],
      pcimc: ['', [Validators.required, Validators.min(0), Validators.max(100), ValidarNumerosFloat]],
      pct: ['', [Validators.required, Validators.min(0), Validators.max(100), ValidarNumerosFloat]],
    });
  }

  ngOnInit(): void {
    if (this.consulta) {
      // llenar form y deshabilitarlo
      this.completarCampos();
      this.clinicaForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
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
    return formErrors;
  }

  enviarFormulario() {
    this.verErroresFormulario();
    if (this.clinicaForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta medica clinica?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const formValues = this.clinicaForm.value;
          formValues.segto = formValues.segto === 'true';
          formValues.leche = formValues.leche === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            odontologia: formValues.derivacion_odontologia,
            oftalmologia: formValues.derivacion_oftalmologia,
            fonoaudiologia: formValues.derivacion_fonoaudiologia,
            externa: formValues.derivacion_externa,
          };
          delete formValues.derivacion_externa;
          delete formValues.derivacion_fonoaudiologia;
          delete formValues.derivacion_odontologia;
          delete formValues.derivacion_oftalmologia;
          delete formValues.dni;
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
            //...(Object.keys(derivaciones).length > 0 && derivaciones.constructor === Object && { derivaciones }),
            clinica: {
              ...clinicaValues,
            },
          };

          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.clinicaForm.reset();
                // Estos set value son para que se mantegna el mensaje despues de enviar 1 consulta
                this.clinicaForm.get('id_institucion')?.setValue('');
                this.clinicaForm.get('id_curso')?.setValue('');
                this.clinicaForm.get('turno')?.setValue('');
                this.clinicaForm.get('obra_social')?.setValue('');

                this.clinicaForm.get('leche')?.setValue('');
                this.clinicaForm.get('ortopedia_traumatologia')?.setValue('');
                this.clinicaForm.get('examen_visual')?.setValue('');
                this.clinicaForm.get('lenguaje')?.setValue('');
                this.clinicaForm.get('vacunas')?.setValue('');
                this.clinicaForm.get('infusiones')?.setValue('');
                this.clinicaForm.get('cantidad_comidas')?.setValue('');
                this.clinicaForm.get('alimentacion')?.setValue('');
                this.clinicaForm.get('hidratacion')?.setValue('');
                this.clinicaForm.get('horas_pantalla')?.setValue('');
                this.clinicaForm.get('horas_juego_aire_libre')?.setValue('');
                this.clinicaForm.get('horas_suenio')?.setValue('');
                this.clinicaForm.get('segto')?.setValue('');
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

  //  ver y modificar
  completarCampos() {
    const derivacion_externa = this.consulta?.derivaciones ? this.consulta?.derivaciones.externa : false;
    const derivacion_odontologia = this.consulta?.derivaciones ? this.consulta?.derivaciones.odontologia : false;
    const derivacion_oftalmologia = this.consulta?.derivaciones ? this.consulta?.derivaciones.oftalmologia : false;
    const derivacion_fonoaudiologia = this.consulta?.derivaciones ? this.consulta?.derivaciones.fonoaudiologia : false;
    this.clinicaForm.patchValue({
      observaciones: this.consulta?.observaciones,
      peso: this.consulta?.clinica?.peso,
      diabetes: this.consulta?.clinica?.diabetes,
      hta: this.consulta?.clinica?.hta,
      obesidad: this.consulta?.clinica?.obesidad,
      consumo_alcohol: this.consulta?.clinica?.consumo_alcohol,
      consumo_drogas: this.consulta?.clinica?.consumo_drogas,
      consumo_tabaco: this.consulta?.clinica?.consumo_tabaco,
      antecedentes_perinatal: this.consulta?.clinica?.antecedentes_perinatal,
      enfermedades_previas: this.consulta?.clinica?.enfermedades_previas,
      vacunas: this.consulta?.clinica?.vacunas,
      talla: this.consulta?.clinica?.talla,
      cc: this.consulta?.clinica?.cc,
      tas: this.consulta?.clinica?.tas,
      tad: this.consulta?.clinica?.tad,
      examen_visual: this.consulta?.clinica?.examen_visual,
      ortopedia_traumatologia: this.consulta?.clinica?.ortopedia_traumatologia,
      lenguaje: this.consulta?.clinica?.lenguaje,
      segto: this.consulta?.clinica?.segto,
      leche: this.consulta?.clinica?.leche,
      infusiones: this.consulta?.clinica?.infusiones,
      cantidad_comidas: this.consulta?.clinica?.cantidad_comidas,
      alimentacion: this.consulta?.clinica?.alimentacion,
      hidratacion: this.consulta?.clinica?.hidratacion,
      horas_pantalla: this.consulta?.clinica?.horas_pantalla,
      horas_juego_aire_libre: this.consulta?.clinica?.horas_juego_aire_libre,
      horas_suenio: this.consulta?.clinica?.horas_suenio,
      derivacion_fonoaudiologia,
      derivacion_oftalmologia,
      derivacion_odontologia,
      derivacion_externa,
      pcta: this.consulta?.clinica?.pcta,
      pcimc: this.consulta?.clinica?.pcimc,
      pct: this.consulta?.clinica?.pct,
    });
  }
  cambiarEstado() {
    if (this.clinicaForm.disabled) {
      this.clinicaForm.enable();
    } else {
      this.clinicaForm.disable();
    }
  }

  existenCambios() {
    let hayCambios = this.clinicaForm.dirty;
    let observaciones = this.clinicaForm.value.observaciones;
    if (this.clinicaForm.value.observaciones !== undefined) {
      if (this.clinicaForm.value.observaciones !== null) {
        observaciones = this.clinicaForm.value.observaciones.trim() === '' ? null : this.clinicaForm.value.observaciones;
      }
    }
    let obra_social = this.clinicaForm.value.obra_social;
    if (typeof obra_social === 'string') {
      obra_social = this.convertToBoolean(obra_social);
    }
    const derivacion_externaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_externa);
    const derivacion_odontologiaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_odontologia);
    const derivacion_fonoaudiologiaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_fonoaudiologia);
    const derivacion_oftalmologiaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_oftalmologia);
    let derivacion_externaConsulta = false;
    if (this.consulta?.derivaciones.externa) {
      derivacion_externaConsulta = this.consulta?.derivaciones.externa;
    }
    let derivacion_odontologiaConsulta = false;
    if (this.consulta?.derivaciones.odontologia) {
      derivacion_odontologiaConsulta = this.consulta?.derivaciones.odontologia;
    }
    let derivacion_fonoaudiologiaConsulta = false;
    if (this.consulta?.derivaciones.fonoaudiologia) {
      derivacion_fonoaudiologiaConsulta = this.consulta?.derivaciones.fonoaudiologia;
    }
    let derivacion_oftalmologiaConsulta = false;
    if (this.consulta?.derivaciones.oftalmologia) {
      derivacion_oftalmologiaConsulta = this.consulta?.derivaciones.oftalmologia;
    }
    const segto = this.convertToBoolean(this.clinicaForm.value.segto);
    const diabetes = this.convertToBoolean(this.clinicaForm.value.diabetes);
    const obesidad = this.convertToBoolean(this.clinicaForm.value.obesidad);
    const consumo_alcohol = this.convertToBoolean(this.clinicaForm.value.consumo_alcohol);
    const consumo_drogas = this.convertToBoolean(this.clinicaForm.value.consumo_drogas);
    const consumo_tabaco = this.convertToBoolean(this.clinicaForm.value.consumo_tabaco);
    const antecedentes_perinatal = this.convertToBoolean(this.clinicaForm.value.antecedentes_perinatal);
    const enfermedades_previas = this.convertToBoolean(this.clinicaForm.value.enfermedades_previas);
    const hta = this.convertToBoolean(this.clinicaForm.value.hta);
    const leche = this.convertToBoolean(this.clinicaForm.value.leche);
    if (hayCambios) {
      if (
        // cambios campos comunes
        this.consulta?.chico?.dni === +this.clinicaForm.value.dni &&
        this.consulta?.institucion?.id === Number(this.clinicaForm.value.id_institucion) &&
        this.consulta?.observaciones === observaciones &&
        this.consulta?.curso?.id === +this.clinicaForm.value.id_curso &&
        this.consulta?.turno === this.clinicaForm.value.turno &&
        this.consulta?.obra_social === obra_social &&
        //  cambios por especialidad
        derivacion_externaConsulta === derivacion_externaForm &&
        derivacion_odontologiaConsulta === derivacion_odontologiaForm &&
        derivacion_fonoaudiologiaConsulta === derivacion_fonoaudiologiaForm &&
        derivacion_oftalmologiaConsulta === derivacion_oftalmologiaForm &&
        this.consulta?.clinica?.peso === this.clinicaForm.value.peso &&
        this.consulta?.clinica?.talla === this.clinicaForm.value.talla &&
        this.consulta?.clinica?.tas === this.clinicaForm.value.tas &&
        this.consulta?.clinica?.tad === this.clinicaForm.value.tad &&
        this.consulta?.clinica?.pcta === this.clinicaForm.value.pcta &&
        this.consulta?.clinica?.pct === this.clinicaForm.value.pct &&
        this.consulta?.clinica?.pcimc === this.clinicaForm.value.pcimc &&
        this.consulta?.clinica?.cc === this.clinicaForm.value.cc &&
        this.consulta?.clinica?.horas_pantalla === this.clinicaForm.value.horas_pantalla &&
        this.consulta?.clinica?.horas_juego_aire_libre === this.clinicaForm.value.horas_juego_aire_libre &&
        this.consulta?.clinica?.horas_suenio === this.clinicaForm.value.horas_suenio &&
        this.consulta?.clinica?.hidratacion === this.clinicaForm.value.hidratacion &&
        this.consulta?.clinica?.alimentacion === this.clinicaForm.value.alimentacion &&
        this.consulta?.clinica?.cantidad_comidas === this.clinicaForm.value.cantidad_comidas &&
        this.consulta?.clinica?.infusiones === this.clinicaForm.value.infusiones &&
        this.consulta?.clinica?.ortopedia_traumatologia === this.clinicaForm.value.ortopedia_traumatologia &&
        this.consulta?.clinica?.lenguaje === this.clinicaForm.value.lenguaje &&
        this.consulta?.clinica?.examen_visual === this.clinicaForm.value.examen_visual &&
        this.consulta?.clinica?.vacunas === this.clinicaForm.value.vacunas &&
        this.consulta?.clinica?.ortopedia_traumatologia === this.clinicaForm.value.ortopedia_traumatologia &&
        this.consulta?.clinica?.segto === segto &&
        this.consulta?.clinica?.diabetes === diabetes &&
        this.consulta?.clinica?.obesidad === obesidad &&
        this.consulta?.clinica?.consumo_alcohol === consumo_alcohol &&
        this.consulta?.clinica?.consumo_drogas === consumo_drogas &&
        this.consulta?.clinica?.consumo_tabaco === consumo_tabaco &&
        this.consulta?.clinica?.antecedentes_perinatal === antecedentes_perinatal &&
        this.consulta?.clinica?.enfermedades_previas === enfermedades_previas &&
        this.consulta?.clinica?.hta === hta &&
        this.consulta?.clinica?.leche === leche
      ) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.clinicaForm.valid && hayCambios);
  }
  convertToBoolean(value: string | boolean): boolean {
    return value === true || value === 'true';
  }

  modificarConsulta() {
    if (this.clinicaForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios en la consulta?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const formValues = this.clinicaForm.value;
          formValues.segto = formValues.segto === 'true';
          formValues.leche = formValues.leche === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            odontologia: formValues.derivacion_odontologia,
            oftalmologia: formValues.derivacion_oftalmologia,
            fonoaudiologia: formValues.derivacion_fonoaudiologia,
            externa: formValues.derivacion_externa,
          };
          delete formValues.derivacion_externa;
          delete formValues.derivacion_fonoaudiologia;
          delete formValues.derivacion_odontologia;
          delete formValues.derivacion_oftalmologia;
          delete formValues.dni;
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
            ...(Object.keys(derivaciones).length > 0 && derivaciones.constructor === Object && { derivaciones }),
            clinica: {
              ...clinicaValues,
            },
          };
          if (this.consulta) {
            this._consultaService.modficarConsulta(this.consulta?.id, data).subscribe({
              next: (response: any) => {
                if (response.success) {
                  MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                  this.cambiarEstado();
                  const consultaMod = response.data;
                  this.modificoConsulta.emit(consultaMod);
                }
              },
              error: (err) => {
                MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
              },
            });
          }
        }
      });
    }
  }
}
