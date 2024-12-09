import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional } from '../../../../utils/validadores';
import { ConsultaService } from '../../../../services/consulta.service';
import { InputTextareaComponent } from '../../../../components/inputs/input-textarea.component';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputSelectEnumComponent } from '../../../../components/inputs/input-select-enum.component';
import { Consulta } from '../../../../models/consulta.model';
import { DatosMedicoComponent } from '../../components/datos-medico/datos-medico.component';

@Component({
  selector: 'app-nueva-fonoaudiologia',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CamposComunesComponent, DatosMedicoComponent, InputTextareaComponent, InputSelectEnumComponent],
  templateUrl: './nueva-fonoaudiologia.component.html',
  styleUrl: './nueva-fonoaudiologia.component.css',
})
export class NuevaFonoaudiologicaComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Input() editar = true;
  @Output() modificoConsulta = new EventEmitter<any>();
  habilitarModificar = false;

  public fonoaudiologiaForm: FormGroup;
  public fechaManana = new Date(new Date().setDate(new Date().getDate() + 1));

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _consultaService: ConsultaService,
  ) {
    this.fonoaudiologiaForm = this.fb.group({
      // Campos comunes
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos Fonoaudiologica
      derivacion_externa: ['', [Validators.required]],
      diagnostico_presuntivo: ['', [Validators.required]],
      causas: ['', [Validators.required]],
      asistencia: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    if (this.consulta) {
      // llenar form y deshabilitarlo
      this.completarCampos();
      this.fonoaudiologiaForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
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
          formValues.asistencia = formValues.asistencia === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            externa: formValues.derivacion_externa === 'true',
            odontologia: false,
            oftalmologia: false,
            fonoaudiologia: false,
          };
          delete formValues.derivacion_externa;
          delete formValues.dni;
          const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, ...fonoaudiologiaValues } = formValues;
          const data = {
            type: 'Fonoaudiologia',
            turno,
            obra_social,
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: id_chico,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            derivaciones,
            fonoaudiologia: {
              ...fonoaudiologiaValues,
            },
          };
          this._consultaService.cargarConsulta(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.fonoaudiologiaForm.reset();
                // Estos set value son para que se mantegna el mensaje despues de enviar 1 consulta
                this.fonoaudiologiaForm.get('id_institucion')?.setValue('');
                this.fonoaudiologiaForm.get('id_curso')?.setValue('');
                this.fonoaudiologiaForm.get('turno')?.setValue('');
                this.fonoaudiologiaForm.get('obra_social')?.setValue('');
                this.fonoaudiologiaForm.get('derivacion_externa')?.setValue('');
                this.fonoaudiologiaForm.get('diagnostico_presuntivo')?.setValue('');
                this.fonoaudiologiaForm.get('causas')?.setValue('');
                this.fonoaudiologiaForm.get('asistencia')?.setValue('');
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

  //  ver y modificar
  completarCampos() {
    const derivacion = this.consulta?.derivaciones ? this.consulta?.derivaciones.externa : false;
    this.fonoaudiologiaForm.patchValue({
      observaciones: this.consulta?.observaciones,
      derivacion_externa: derivacion,
      diagnostico_presuntivo: this.consulta?.fonoaudiologia?.diagnostico_presuntivo,
      causas: this.consulta?.fonoaudiologia?.causas,
      asistencia: this.consulta?.fonoaudiologia?.asistencia,
    });
    // this.fonoaudiologiaForm.disable()
  }

  cambiarEstado() {
    if (this.fonoaudiologiaForm.disabled) {
      this.fonoaudiologiaForm.enable();
    } else {
      this.fonoaudiologiaForm.disable();
    }
  }

  existenCambios() {
    let hayCambios = this.fonoaudiologiaForm.dirty;
    let observaciones = this.fonoaudiologiaForm.value.observaciones;
    if (this.fonoaudiologiaForm.value.observaciones !== undefined) {
      if (this.fonoaudiologiaForm.value.observaciones !== null) {
        observaciones = this.fonoaudiologiaForm.value.observaciones.trim() === '' ? null : this.fonoaudiologiaForm.value.observaciones;
      }
    }
    let obra_social = this.fonoaudiologiaForm.value.obra_social;
    if (typeof obra_social === 'string') {
      obra_social = this.convertToBoolean(obra_social);
    }

    const derivacion_externaForm = this.convertToBoolean(this.fonoaudiologiaForm.value.derivacion_externa);
    let derivacion_externaConsulta = false;
    if (this.consulta?.derivaciones) {
      derivacion_externaConsulta = this.consulta?.derivaciones.externa;
    }
    const asistencia = this.convertToBoolean(this.fonoaudiologiaForm.value.asistencia);
    if (hayCambios) {
      if (
        // cambios campos comunes
        this.consulta?.chico?.dni === +this.fonoaudiologiaForm.value.dni &&
        this.consulta?.institucion?.id === Number(this.fonoaudiologiaForm.value.id_institucion) &&
        this.consulta?.observaciones === observaciones &&
        this.consulta?.curso?.id === +this.fonoaudiologiaForm.value.id_curso &&
        this.consulta?.turno === this.fonoaudiologiaForm.value.turno &&
        this.consulta?.obra_social === obra_social &&
        //  cambios por especialidad
        derivacion_externaConsulta === derivacion_externaForm &&
        this.consulta?.fonoaudiologia?.asistencia === asistencia &&
        this.consulta?.fonoaudiologia?.diagnostico_presuntivo === this.fonoaudiologiaForm.value.diagnostico_presuntivo &&
        this.consulta?.fonoaudiologia?.causas === this.fonoaudiologiaForm.value.causas
      ) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.fonoaudiologiaForm.valid && hayCambios);
  }

  convertToBoolean(value: string | boolean): boolean {
    return value === true || value === 'true';
  }

  modificarConsulta() {
    if (this.fonoaudiologiaForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios en la consulta?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const formValues = this.fonoaudiologiaForm.value;
          formValues.asistencia = formValues.asistencia === 'true';
          formValues.obra_social = formValues.obra_social === 'true';
          const derivaciones = {
            externa: formValues.derivacion_externa === 'true',
            odontologia: false,
            oftalmologia: false,
            fonoaudiologia: false,
          };
          delete formValues.derivacion_externa;
          delete formValues.dni;
          const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, ...fonoaudiologiaValues } = formValues;
          const data = {
            type: 'Fonoaudiologia',
            turno,
            obra_social,
            ...(observaciones && { observaciones }),
            edad: parseInt(edad),
            id_chico: id_chico,
            id_institucion: parseInt(id_institucion),
            id_curso: parseInt(id_curso),
            derivaciones,
            fonoaudiologia: {
              ...fonoaudiologiaValues,
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
