import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarNumerosFloat } from '@utils/validadores';
import { ConsultaService } from '@services/consulta.service';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputNumberComponent } from '@components/inputs/input-number.component';
import { InputCheckboxComponent } from '@components/inputs/input-checkbox.component';
import { InputTextareaComponent } from '@components/inputs/input-textarea.component';
import { InputSelectEnumComponent } from '@components/inputs/input-select-enum.component';
import { Consulta } from '@models/consulta.model';
import { DatosMedicoComponent } from '../../components/datos-medico/datos-medico.component';
import { Router } from '@angular/router';
import { LoadingComponent } from '@app/components/loading/loading.component';

@Component({
  selector: 'app-nueva-clinica',
  standalone: true,
  imports: [CommonModule, LoadingComponent, ReactiveFormsModule, DatosMedicoComponent, CamposComunesComponent, InputNumberComponent, InputCheckboxComponent, InputTextareaComponent, InputSelectEnumComponent],
  templateUrl: './nueva-clinica.component.html',
})
export class NuevaClinicaComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Input() editar = true;
  @Output() modificoConsulta = new EventEmitter<any>();
  habilitarModificar = false;
  mostrarClinica = true;
  loading = false;
  public clinicaForm: FormGroup;
  public con = Constantes;
  dni: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
    private _router: Router,
  ) {
    const navigation = this._router.getCurrentNavigation();
    this.dni = navigation?.extras?.state ? navigation?.extras?.state['dni'] : null;

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
      hidratacion: ['', [Validators.required]],
      horas_pantalla: ['', [Validators.required]],
      horas_juego_aire_libre: ['', [Validators.required]],
      horas_suenio: ['', [Validators.required]],
      derivacion_fonoaudiologia: [false, []],
      derivacion_oftalmologia: [false, []],
      derivacion_odontologia: [false, []],
      derivacion_prevencion: [false, []],
      derivacion_social: [false, []],
      //derivacion_externa: [false, []],
      es_clinica: [true, [Validators.required]],
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
          this.loading = true;
          const data = this.setData();
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              this.loading = false;
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
                // this.clinicaForm.get('es_clinica')?.setValue(true);
              }
            },
            error: (err) => {
              this.loading = false;
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
        }
      });
    } else {
      this.clinicaForm.markAllAsTouched();
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
    console.log(this.consulta);
    // const derivacion_externa = this.consulta?.derivacion_externa ? true : false;
    const derivacion_odontologia = this.consulta?.derivacion_odontologia ? true : false;
    const derivacion_prevencion = this.consulta?.derivacion_prevencion ? true : false;
    const derivacion_social = this.consulta?.derivacion_social ? true : false;
    const derivacion_oftalmologia = this.consulta?.derivacion_oftalmologia ? true : false;
    const derivacion_fonoaudiologia = this.consulta?.derivacion_fonoaudiologia ? true : false;
    console.log(this.consulta?.clinica?.es_clinica, typeof this.consulta?.clinica?.es_clinica);
    if (this.consulta?.clinica?.es_clinica) {
      this.mostrarClinica = true;
    } else {
      this.mostrarClinica = false;
    }
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
      derivacion_prevencion,
      derivacion_social,
      // derivacion_externa,
      es_clinica: this.consulta?.clinica?.es_clinica,
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
    // const derivacion_externaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_externa);
    const derivacion_odontologiaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_odontologia);
    const derivacion_fonoaudiologiaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_fonoaudiologia);
    const derivacion_oftalmologiaForm = this.convertToBoolean(this.clinicaForm.value.derivacion_oftalmologia);
    const derivacion_prevencionForm = this.convertToBoolean(this.clinicaForm.value.derivacion_prevencion);
    const derivacion_socialForm = this.convertToBoolean(this.clinicaForm.value.derivacion_social);
    // let derivacion_externaConsulta = false;
    // if (this.consulta?.derivacion_externa) {
    //   derivacion_externaConsulta = this.consulta?.derivacion_externa;
    // }
    let derivacion_odontologiaConsulta = false;
    if (this.consulta?.derivacion_odontologia) {
      derivacion_odontologiaConsulta = this.consulta?.derivacion_odontologia;
    }
    let derivacion_fonoaudiologiaConsulta = false;
    if (this.consulta?.derivacion_fonoaudiologia) {
      derivacion_fonoaudiologiaConsulta = this.consulta?.derivacion_fonoaudiologia;
    }
    let derivacion_oftalmologiaConsulta = false;
    if (this.consulta?.derivacion_oftalmologia) {
      derivacion_oftalmologiaConsulta = this.consulta?.derivacion_oftalmologia;
    }
    let derivacion_prevencionConsulta = false;
    if (this.consulta?.derivacion_prevencion) {
      derivacion_prevencionConsulta = this.consulta?.derivacion_prevencion;
    }
    let derivacion_socialConsulta = false;
    if (this.consulta?.derivacion_social) {
      derivacion_socialConsulta = this.consulta?.derivacion_social;
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
    const es_clinica = this.convertToBoolean(this.clinicaForm.value.es_clinica);
    console.log(this.clinicaForm.value.es_clinica);
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
        // derivacion_externaConsulta === derivacion_externaForm &&
        derivacion_odontologiaConsulta === derivacion_odontologiaForm &&
        derivacion_fonoaudiologiaConsulta === derivacion_fonoaudiologiaForm &&
        derivacion_oftalmologiaConsulta === derivacion_oftalmologiaForm &&
        derivacion_prevencionConsulta === derivacion_prevencionForm &&
        derivacion_socialConsulta === derivacion_socialForm &&
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
        this.consulta?.clinica?.leche === leche &&
        this.consulta?.clinica?.es_clinica === es_clinica
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
          console.log(this.clinicaForm.value);
          const data = this.setData();
          console.log(data);
          this.loading = true;
          if (this.consulta) {
            this._consultaService.modficarConsulta(this.consulta?.id, data).subscribe({
              next: (response: any) => {
                this.loading = false;
                if (response.success) {
                  MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                  this.cambiarEstado();
                  const consultaMod = response.data;
                  this.modificoConsulta.emit(consultaMod);
                }
              },
              error: (err) => {
                this.loading = false;
                MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
              },
            });
          }
        }
      });
    } else {
      this.clinicaForm.markAllAsTouched();
    }
  }

  setData() {
    const formValues = this.clinicaForm.value;
    formValues.segto = formValues.segto === 'true';
    formValues.leche = formValues.leche === 'true';
    formValues.obra_social = formValues.obra_social === 'true';
    delete formValues.dni;

    const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, derivacion_fonoaudiologia, derivacion_odontologia, derivacion_oftalmologia, derivacion_prevencion, derivacion_social, ...clinicaValues } = formValues;
    const data = {
      type: 'Clinica',
      turno,
      obra_social,
      ...(observaciones && { observaciones }),
      edad: parseInt(edad),
      id_chico: id_chico,
      id_institucion: parseInt(id_institucion),
      id_curso: parseInt(id_curso),
      ...(derivacion_fonoaudiologia && { derivacion_fonoaudiologia }),
      ...(derivacion_odontologia && { derivacion_odontologia }),
      ...(derivacion_oftalmologia && { derivacion_oftalmologia }),
      ...(derivacion_prevencion && { derivacion_prevencion }),
      ...(derivacion_social && { derivacion_social }),
      clinica: {
        ...clinicaValues,
      },
    };
    return data;
  }

  onChangeEsClinica(event: any) {
    const esClinica = event.target.value === 'true';
    if (esClinica) {
      this.mostrarClinica = true;
      this.clinicaForm.get('es_clinica')?.setValue(true);
    } else {
      this.mostrarClinica = false;
      this.clinicaForm.get('es_clinica')?.setValue(false);
    }
    this.cambiarValidaciones(this.mostrarClinica);
  }

  cambiarValidaciones(esClinica: boolean) {
    if (esClinica) {
      const pesoControl = this.clinicaForm.get('peso');
      pesoControl?.setValidators([Validators.required]);

      const observacionesControl = this.clinicaForm.get('observaciones');
      observacionesControl?.setValidators([ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]);

      const vacunasControl = this.clinicaForm.get('vacunas');
      vacunasControl?.setValidators([Validators.required]);

      const tallaControl = this.clinicaForm.get('talla');
      tallaControl?.setValidators([Validators.required, ValidarNumerosFloat]);

      const ccControl = this.clinicaForm.get('cc');
      ccControl?.setValidators([Validators.required, ValidarNumerosFloat]);

      const tasControl = this.clinicaForm.get('tas');
      tasControl?.setValidators([Validators.required, ValidarNumerosFloat]);

      const tadControl = this.clinicaForm.get('tad');
      tadControl?.setValidators([Validators.required, ValidarNumerosFloat]);

      const examenVisualControl = this.clinicaForm.get('examen_visual');
      examenVisualControl?.setValidators([Validators.required]);

      const ortopediaTraumatologiaControl = this.clinicaForm.get('ortopedia_traumatologia');
      ortopediaTraumatologiaControl?.setValidators([Validators.required]);

      const lenguajeControl = this.clinicaForm.get('lenguaje');
      lenguajeControl?.setValidators([Validators.required]);

      const segtoControl = this.clinicaForm.get('segto');
      segtoControl?.setValidators([Validators.required]);

      const lecheControl = this.clinicaForm.get('leche');
      lecheControl?.setValidators([Validators.required]);

      const infusionesControl = this.clinicaForm.get('infusiones');
      infusionesControl?.setValidators([Validators.required]);

      const cantidadComidasControl = this.clinicaForm.get('cantidad_comidas');
      cantidadComidasControl?.setValidators([Validators.required]);

      const alimentacionControl = this.clinicaForm.get('alimentacion');
      alimentacionControl?.setValidators([Validators.required]);

      const hidratacionControl = this.clinicaForm.get('hidratacion');
      hidratacionControl?.setValidators([Validators.required]);

      const horasPantallaControl = this.clinicaForm.get('horas_pantalla');
      horasPantallaControl?.setValidators([Validators.required]);

      const horasJuegoAireLibreControl = this.clinicaForm.get('horas_juego_aire_libre');
      horasJuegoAireLibreControl?.setValidators([Validators.required]);

      const horasSuenioControl = this.clinicaForm.get('horas_suenio');
      horasSuenioControl?.setValidators([Validators.required]);

      const derivacionFonoaudiologiaControl = this.clinicaForm.get('derivacion_fonoaudiologia');
      derivacionFonoaudiologiaControl?.setValidators([]);

      const derivacionOftalmologiaControl = this.clinicaForm.get('derivacion_oftalmologia');
      derivacionOftalmologiaControl?.setValidators([]);

      const derivacionOdontologiaControl = this.clinicaForm.get('derivacion_odontologia');
      derivacionOdontologiaControl?.setValidators([]);

      const derivacionPrevencionControl = this.clinicaForm.get('derivacion_prevencion');
      derivacionPrevencionControl?.setValidators([]);

      const derivacionSocialControl = this.clinicaForm.get('derivacion_social');
      derivacionSocialControl?.setValidators([]);

      const derivacionExternaControl = this.clinicaForm.get('derivacion_externa');
      derivacionExternaControl?.setValidators([]);

      const esClinicaControl = this.clinicaForm.get('es_clinica');
      esClinicaControl?.setValidators([Validators.required]);

      const pctaControl = this.clinicaForm.get('pcta');
      pctaControl?.setValidators([Validators.required, Validators.min(0), Validators.max(100), ValidarNumerosFloat]);

      const pcimcControl = this.clinicaForm.get('pcimc');
      pcimcControl?.setValidators([Validators.required, Validators.min(0), Validators.max(100), ValidarNumerosFloat]);

      const pctControl = this.clinicaForm.get('pct');
      pctControl?.setValidators([Validators.required, Validators.min(0), Validators.max(100), ValidarNumerosFloat]);
    } else {
      const diabetesControl = this.clinicaForm.get('diabetes');
      diabetesControl?.clearValidators();
      diabetesControl?.setValue(null);

      const htaControl = this.clinicaForm.get('hta');
      htaControl?.clearValidators();
      htaControl?.setValue(null);

      const obesidadControl = this.clinicaForm.get('obesidad');
      obesidadControl?.clearValidators();
      obesidadControl?.setValue(null);

      const consumoAlcoholControl = this.clinicaForm.get('consumo_alcohol');
      consumoAlcoholControl?.clearValidators();
      consumoAlcoholControl?.setValue(null);

      const consumoDrogasControl = this.clinicaForm.get('consumo_drogas');
      consumoDrogasControl?.clearValidators();
      consumoDrogasControl?.setValue(null);

      const consumoTabacoControl = this.clinicaForm.get('consumo_tabaco');
      consumoTabacoControl?.clearValidators();
      consumoTabacoControl?.setValue(null);

      const antecedentesPerinatalControl = this.clinicaForm.get('antecedentes_perinatal');
      antecedentesPerinatalControl?.clearValidators();
      antecedentesPerinatalControl?.setValue(null);

      const enfermedadesPreviasControl = this.clinicaForm.get('enfermedades_previas');
      enfermedadesPreviasControl?.clearValidators();
      enfermedadesPreviasControl?.setValue(null);

      const vacunasControl = this.clinicaForm.get('vacunas');
      vacunasControl?.clearValidators();
      vacunasControl?.setValue(null);

      const tasControl = this.clinicaForm.get('tas');
      tasControl?.clearValidators();
      tasControl?.setValue(null);

      const tadControl = this.clinicaForm.get('tad');
      tadControl?.clearValidators();
      tadControl?.setValue(null);

      const examenVisualControl = this.clinicaForm.get('examen_visual');
      examenVisualControl?.clearValidators();
      examenVisualControl?.setValue(null);

      const ortopediaTraumatologiaControl = this.clinicaForm.get('ortopedia_traumatologia');
      ortopediaTraumatologiaControl?.clearValidators();
      ortopediaTraumatologiaControl?.setValue(null);

      const lenguajeControl = this.clinicaForm.get('lenguaje');
      lenguajeControl?.clearValidators();
      lenguajeControl?.setValue(null);

      const lecheControl = this.clinicaForm.get('leche');
      lecheControl?.clearValidators();
      lecheControl?.setValue(null);

      const infusionesControl = this.clinicaForm.get('infusiones');
      infusionesControl?.clearValidators();
      infusionesControl?.setValue(null);

      const cantidadComidasControl = this.clinicaForm.get('cantidad_comidas');
      cantidadComidasControl?.clearValidators();
      cantidadComidasControl?.setValue(null);

      const alimentacionControl = this.clinicaForm.get('alimentacion');
      alimentacionControl?.clearValidators();
      alimentacionControl?.setValue(null);

      const hidratacionControl = this.clinicaForm.get('hidratacion');
      hidratacionControl?.clearValidators();
      hidratacionControl?.setValue(null);

      const horasPantallaControl = this.clinicaForm.get('horas_pantalla');
      horasPantallaControl?.clearValidators();
      horasPantallaControl?.setValue(null);

      const horasJuegoAireLibreControl = this.clinicaForm.get('horas_juego_aire_libre');
      horasJuegoAireLibreControl?.clearValidators();
      horasJuegoAireLibreControl?.setValue(null);

      const horasSuenioControl = this.clinicaForm.get('horas_suenio');
      horasSuenioControl?.clearValidators();
      horasSuenioControl?.setValue(null);
      /*
      const derivacionFonoaudiologiaControl = this.clinicaForm.get('derivacion_fonoaudiologia');
      derivacionFonoaudiologiaControl?.clearValidators();
      derivacionFonoaudiologiaControl?.setValue(null);

      const derivacionOftalmologiaControl = this.clinicaForm.get('derivacion_oftalmologia');
      derivacionOftalmologiaControl?.clearValidators();
      derivacionOftalmologiaControl?.setValue(null);

      const derivacionOdontologiaControl = this.clinicaForm.get('derivacion_odontologia');
      derivacionOdontologiaControl?.clearValidators();
      derivacionOdontologiaControl?.setValue(null);

      const derivacionPrevencionControl = this.clinicaForm.get('derivacion_prevencion');
      derivacionPrevencionControl?.clearValidators();
      derivacionPrevencionControl?.setValue(null);

      const derivacionSocialControl = this.clinicaForm.get('derivacion_social');
      derivacionSocialControl?.clearValidators();
      derivacionSocialControl?.setValue(null);

      const derivacionExternaControl = this.clinicaForm.get('derivacion_externa');
      derivacionExternaControl?.clearValidators();
      derivacionExternaControl?.setValue(null);
      */
      const pctaControl = this.clinicaForm.get('pcta');
      pctaControl?.clearValidators();
      pctaControl?.setValue(null);
    }
  }
}
