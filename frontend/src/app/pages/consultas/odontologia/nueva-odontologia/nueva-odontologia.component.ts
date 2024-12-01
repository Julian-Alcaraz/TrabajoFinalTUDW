import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarSoloNumeros } from '../../../../utils/validadores';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ConsultaService } from '../../../../services/consulta.service';
import { InputNumberComponent } from '../../../../components/inputs/input-number.component';
import { InputTextareaComponent } from '../../../../components/inputs/input-textarea.component';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputSelectEnumComponent } from '../../../../components/inputs/input-select-enum.component';
import { Chico } from '../../../../models/chico.model';
import { Consulta } from '../../../../models/consulta.model';
import { DatosMedicoComponent } from '../../components/datos-medico/datos-medico.component';

@Component({
  selector: 'app-nueva-odontologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatosMedicoComponent, CamposComunesComponent, InputNumberComponent, InputTextareaComponent, InputSelectEnumComponent],
  templateUrl: './nueva-odontologia.component.html',
  styleUrl: './nueva-odontologia.component.css',
})
export class NuevaOdontologiaComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Input() editar = true;
  habilitarModificar = false;

  public odontologiaForm: FormGroup;
  public chico: Chico | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.odontologiaForm = this.fb.group({
      // Campos comunes
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos odontologia
      // Campos odontologia
      primera_vez: ['', [Validators.required]],
      ulterior: ['', [Validators.required]],
      cepillo: ['', [Validators.required]],
      cepillado: ['', [Validators.required]],
      topificacion: ['', [Validators.required]],
      derivacion_externa: ['', [Validators.required]],
      dientes_permanentes: [null, [Validators.required, ValidarSoloNumeros]],
      dientes_temporales: [null, [Validators.required, ValidarSoloNumeros]],
      sellador: ['', [Validators.required, ValidarSoloNumeros]],
      dientes_recuperables: [null, [Validators.required, ValidarSoloNumeros]],
      dientes_irecuperables: [null, [Validators.required, ValidarSoloNumeros]],
      // situacion_bucal: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      habitos: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
    });
  }
  ngOnInit(): void {
    if (this.consulta) {
      // llenar form y deshabilitarlo
      this.completarCampos();
      this.odontologiaForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
  }
  recibirChico(chicoRecibido: Chico | null) {
    this.chico = chicoRecibido;
    if (!this.consulta) {
      if (this.chico) this.esPrimeraVez(this.chico.id);
    }
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
          formValues.cepillado = formValues.cepillado === 'true';
          formValues.cepillo = formValues.cepillo === 'true';
          formValues.topificacion = formValues.topificacion === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            externa: formValues.derivacion_externa === 'true',
            odontologia: false,
            oftalmologia: false,
            fonoaudiologia: false,
          };
          delete formValues.derivacion_externa;
          const { turno, edad, obra_social, observaciones, habitos, id_institucion, id_curso, id_chico, ...odontologicaValues } = formValues;
          const data = {
            type: 'Odontologia',
            turno,
            obra_social,
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: id_chico,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            derivaciones,
            odontologia: {
              ...(habitos && { habitos }),
              ...odontologicaValues,
            },
          };
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

  //  ver y modificar
  completarCampos() {
    const derivacion = this.consulta?.derivaciones ? this.consulta?.derivaciones.externa : false;
    this.odontologiaForm.patchValue({
      observaciones: this.consulta?.observaciones,
      derivacion_externa: derivacion,
      primera_vez: this.consulta?.odontologia?.primera_vez,
      ulterior: this.consulta?.odontologia?.ulterior,
      cepillo: this.consulta?.odontologia?.cepillo,
      cepillado: this.consulta?.odontologia?.cepillado,
      topificacion: this.consulta?.odontologia?.topificacion,
      dientes_permanentes: this.consulta?.odontologia?.dientes_permanentes,
      dientes_temporales: this.consulta?.odontologia?.dientes_temporales,
      sellador: this.consulta?.odontologia?.sellador,
      dientes_recuperables: this.consulta?.odontologia?.dientes_recuperables,
      dientes_irecuperables: this.consulta?.odontologia?.dientes_irecuperables,
      habitos: this.consulta?.odontologia?.habitos,
    });
  }
  cambiarEstado() {
    if (this.odontologiaForm.disabled) {
      this.odontologiaForm.enable();
    } else {
      this.odontologiaForm.disable();
    }
  }

  existenCambios() {
    let hayCambios = this.odontologiaForm.dirty;
    let observaciones = this.odontologiaForm.value.observaciones;
    if (this.odontologiaForm.value.observaciones !== undefined) {
      if (this.odontologiaForm.value.observaciones !== null) {
        observaciones = this.odontologiaForm.value.observaciones.trim() === '' ? null : this.odontologiaForm.value.observaciones;
      }
    }
    let obra_social = this.odontologiaForm.value.obra_social;
    if (typeof obra_social === 'string') {
      obra_social = this.convertToBoolean(obra_social);
    }
    const derivacion_externaForm = this.convertToBoolean(this.odontologiaForm.value.derivacion_externa);
    let derivacion_externaConsulta = false;
    if (this.consulta?.derivaciones) {
      derivacion_externaConsulta = this.consulta?.derivaciones.externa;
    }
    const cepillo = this.convertToBoolean(this.odontologiaForm.value.cepillo);
    const cepillado = this.convertToBoolean(this.odontologiaForm.value.cepillado);
    const topificacion = this.convertToBoolean(this.odontologiaForm.value.topificacion);
    if (hayCambios) {
      if (
        // cambios campos comunes
        this.consulta?.chico?.dni === +this.odontologiaForm.value.dni &&
        this.consulta?.institucion?.id === Number(this.odontologiaForm.value.id_institucion) &&
        this.consulta?.observaciones === observaciones &&
        this.consulta?.curso?.id === +this.odontologiaForm.value.id_curso &&
        this.consulta?.turno === this.odontologiaForm.value.turno &&
        this.consulta?.obra_social === obra_social &&
        //  cambios por especialidad
        derivacion_externaConsulta === derivacion_externaForm &&
        this.consulta?.odontologia?.cepillo === cepillo &&
        this.consulta?.odontologia?.cepillado === cepillado &&
        this.consulta?.odontologia?.topificacion === topificacion &&
        this.consulta?.odontologia?.dientes_permanentes === this.odontologiaForm.value.dientes_permanentes &&
        this.consulta?.odontologia?.dientes_temporales === this.odontologiaForm.value.dientes_temporales &&
        this.consulta?.odontologia?.sellador === this.odontologiaForm.value.sellador &&
        this.consulta?.odontologia?.dientes_recuperables === this.odontologiaForm.value.dientes_recuperables &&
        this.consulta?.odontologia?.dientes_irecuperables === this.odontologiaForm.value.dientes_irecuperables &&
        this.consulta?.odontologia?.habitos === this.odontologiaForm.value.habitos
      ) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.odontologiaForm.valid && hayCambios);
  }
  convertToBoolean(value: string | boolean): boolean {
    return value === true || value === 'true';
  }
  modificarConsulta() {
    if (this.odontologiaForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios en la consulta?',
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
          if (this.consulta) {
            this._consultaService.modficarConsulta(this.consulta?.id, data).subscribe({
              next: (response: any) => {
                if (response.success) {
                  MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                  this.cambiarEstado();
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
