import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional } from '@utils/validadores';
import { ConsultaService } from '@services/consulta.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputTextareaComponent } from '@components/inputs/input-textarea.component';
import { InputSelectEnumComponent } from '@components/inputs/input-select-enum.component';
import { InputDateComponent } from '@components/inputs/input-date.component';
import { Chico } from '@models/chico.model';
import { Consulta } from '@models/consulta.model';
import { DatosMedicoComponent } from '../../components/datos-medico/datos-medico.component';

@Component({
  selector: 'app-nueva-oftalmologia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, DatosMedicoComponent, MatFormFieldModule, MatInputModule, CamposComunesComponent, InputTextareaComponent, InputSelectEnumComponent, InputDateComponent],
  templateUrl: './nueva-oftalmologia.component.html',
  styleUrl: './nueva-oftalmologia.component.css',
})
export class NuevaOftalmologiaComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Input() editar = true;
  @Output() modificoConsulta = new EventEmitter<any>();
  habilitarModificar = false;

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

  ngOnInit(): void {
    if (this.consulta) {
      // llenar form y deshabilitarlo
      this.completarCampos();
      this.oftalmologiaForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.oftalmologiaForm.get(input) as FormControl;
  }

  recibirChico(chicoRecibido: Chico | null) {
    this.chico = chicoRecibido;
    if (!this.consulta) {
      if (this.chico) this.esPrimeraVez(this.chico.id);
    }
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
          formValues.receta = formValues.receta === 'true';
          if (formValues.anteojos !== null) formValues.anteojos = formValues.anteojos === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            externa: formValues.derivacion_externa === 'true',
            odontologia: false,
            oftalmologia: false,
            fonoaudiologia: false,
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
            derivaciones,
            oftalmologia: {
              ...oftalmologiaValues,
            },
          };
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                // Estos set value son para que se mantegna el mensaje despues de enviar 1 consulta
                this.oftalmologiaForm.reset();
                this.oftalmologiaForm.get('id_institucion')?.setValue('');
                this.oftalmologiaForm.get('id_curso')?.setValue('');
                this.oftalmologiaForm.get('turno')?.setValue('');
                this.oftalmologiaForm.get('obra_social')?.setValue('');
                this.oftalmologiaForm.get('demanda')?.setValue('');
                this.oftalmologiaForm.get('receta')?.setValue('');
                this.oftalmologiaForm.get('anteojos')?.setValue('');
                this.oftalmologiaForm.get('derivacion_externa')?.setValue('');
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

  completarCampos() {
    const derivacion = this.consulta?.derivaciones ? this.consulta?.derivaciones.externa : false;
    const anteojos = this.consulta?.oftalmologia?.anteojos;

    const proximoControl = this.devolverFechaReal(this.consulta?.oftalmologia?.prox_control) + 'T12:00:00';
    this.oftalmologiaForm.patchValue({
      observaciones: this.consulta?.observaciones,
      derivacion_externa: derivacion,
      demanda: this.consulta?.oftalmologia?.demanda,
      primera_vez: this.consulta?.oftalmologia?.primera_vez,
      control: this.consulta?.oftalmologia?.control,
      receta: this.consulta?.oftalmologia?.receta,
      ...(anteojos !== null && { anteojos: anteojos }),
      prox_control: proximoControl,
    });
  }
  devolverFechaReal(fecha: any) {
    const aux = new Date(String(fecha));
    aux.setHours(0, 0, 0, 0); // Establecer hora en 00:00:00
    return `${aux.getFullYear()}-${(aux.getMonth() + 1).toString().padStart(2, '0')}-${(aux.getDate() + 1).toString().padStart(2, '0')}`;
  }
  formatearFecha(fecha: any) {
    const aux = new Date(String(fecha));
    aux.setHours(0, 0, 0, 0); // Establecer hora en 00:00:00
    return `${aux.getFullYear()}-${(aux.getMonth() + 1).toString().padStart(2, '0')}-${aux.getDate().toString().padStart(2, '0')}`;
  }
  cambiarEstado() {
    if (this.oftalmologiaForm.disabled) {
      this.oftalmologiaForm.enable();
    } else {
      this.oftalmologiaForm.disable();
    }
  }
  existenCambios() {
    let hayCambios = this.oftalmologiaForm.dirty;
    let observaciones = this.oftalmologiaForm.value.observaciones;
    if (this.oftalmologiaForm.value.observaciones !== undefined) {
      if (this.oftalmologiaForm.value.observaciones !== null) {
        observaciones = this.oftalmologiaForm.value.observaciones.trim() === '' ? null : this.oftalmologiaForm.value.observaciones;
      }
    }
    let obra_social = this.oftalmologiaForm.value.obra_social;
    if (typeof obra_social === 'string') {
      obra_social = this.convertToBoolean(obra_social);
    }

    const derivacion_externaForm = this.convertToBoolean(this.oftalmologiaForm.value.derivacion_externa);
    let derivacion_externaConsulta = false;
    if (this.consulta?.derivaciones) {
      derivacion_externaConsulta = this.consulta?.derivaciones.externa;
    }
    const receta = this.convertToBoolean(this.oftalmologiaForm.value.receta);
    const anteojos = this.convertToBoolean(this.oftalmologiaForm.value.anteojos);
    if (hayCambios) {
      if (
        // cambios campos comunes
        this.consulta?.chico?.dni === +this.oftalmologiaForm.value.dni &&
        this.consulta?.institucion?.id === Number(this.oftalmologiaForm.value.id_institucion) &&
        this.consulta?.observaciones === observaciones &&
        this.consulta?.curso?.id === +this.oftalmologiaForm.value.id_curso &&
        this.consulta?.turno === this.oftalmologiaForm.value.turno &&
        this.consulta?.obra_social === obra_social &&
        //  cambios por especialidad
        derivacion_externaConsulta === derivacion_externaForm &&
        this.consulta?.oftalmologia?.demanda === this.oftalmologiaForm.value.demanda &&
        this.consulta?.oftalmologia?.receta === receta &&
        this.consulta?.oftalmologia?.anteojos === anteojos &&
        this.devolverFechaReal(this.consulta?.oftalmologia?.prox_control) === this.formatearFecha(this.oftalmologiaForm.value.prox_control)
      ) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.oftalmologiaForm.valid && hayCambios);
  }
  convertToBoolean(value: string | boolean): boolean {
    return value === true || value === 'true';
  }
  modificarConsulta() {
    if (this.oftalmologiaForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios en la consulta?',
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
            odontologia: false,
            oftalmologia: false,
            fonoaudiologia: false,
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
            derivaciones,
            oftalmologia: {
              ...oftalmologiaValues,
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
