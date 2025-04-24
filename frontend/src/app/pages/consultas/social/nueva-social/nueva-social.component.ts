import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as Constantes from '@app/common/const/const';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarCampoOpcional } from '@utils/validadores';
import { ConsultaService } from '@services/consulta.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CamposComunesComponent } from '../../components/campos-comunes/campos-comunes.component';
import { InputTextareaComponent } from '@components/inputs/input-textarea.component';
import { InputSelectEnumComponent } from '@components/inputs/input-select-enum.component';
import { Chico } from '@models/chico.model';
import { Consulta } from '@models/consulta.model';
import { DatosMedicoComponent } from '../../components/datos-medico/datos-medico.component';
import { Router } from '@angular/router';
import { LoadingComponent } from '@app/components/loading/loading.component';

@Component({
  selector: 'app-nueva-social',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatosMedicoComponent, MatFormFieldModule, MatInputModule, CamposComunesComponent, InputTextareaComponent, LoadingComponent, InputSelectEnumComponent],
  templateUrl: './nueva-social.component.html',
})
export class NuevaSocialComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Input() editar = true;
  @Output() modificoConsulta = new EventEmitter<any>();
  habilitarModificar = false;
  loading = false;
  public socialForm: FormGroup;
  public chico: Chico | null = null;
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

    this.socialForm = this.fb.group({
      // Campos comunes
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos prevencion
      derivacion_externa: ['', [Validators.required]],
      demanda: ['', [Validators.minLength(0), Validators.maxLength(100)]],
      articulacion: ['', [Validators.minLength(0), Validators.maxLength(1000)]],
      objeto_informe: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(1000)]],
      seguimiento: ['', [Validators.minLength(0), Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    if (this.consulta) {
      // llenar form y deshabilitarlo
      this.completarCampos();
      this.socialForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.socialForm.get(input) as FormControl;
  }

  recibirChico(chicoRecibido: Chico | null) {
    this.chico = chicoRecibido;
  }

  setData() {
    const formValues = this.socialForm.value;
    formValues.obra_social = formValues.obra_social === 'true';
    formValues.derivacion_externa = formValues.derivacion_externa === 'true';

    delete formValues.dni;
    const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, derivacion_externa, ...socialValues } = formValues;
    const data = {
      type: 'Social',
      turno,
      obra_social,
      ...(observaciones && { observaciones }),
      edad: parseInt(edad),
      id_chico: id_chico,
      id_institucion: parseInt(id_institucion),
      id_curso: parseInt(id_curso),
      derivacion_externa,
      derivacion_odontologia: false,
      derivacion_oftalmologia: false,
      derivacion_fonoaudiologia: false,
      social: {
        ...socialValues,
      },
    };
    return data;
  }

  enviarFormulario() {
    if (this.socialForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta trabajo social?',
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
                // Estos set value son para que se mantegna el mensaje despues de enviar 1 consulta
                this.socialForm.reset();
                this.socialForm.get('id_institucion')?.setValue('');
                this.socialForm.get('id_curso')?.setValue('');
                this.socialForm.get('turno')?.setValue('');
                this.socialForm.get('obra_social')?.setValue('');

                this.socialForm.get('demanda')?.setValue('');
                this.socialForm.get('articulacion')?.setValue('');
                this.socialForm.get('frecuencia')?.setValue('');
                this.socialForm.get('objeto_informe')?.setValue('');
                this.socialForm.get('seguimiento')?.setValue('');
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
      this.socialForm.markAllAsTouched();
    }
  }

  completarCampos() {
    const derivacion = this.consulta?.derivacion_externa ? true : false;
    this.socialForm.patchValue({
      observaciones: this.consulta?.observaciones,
      derivacion_externa: derivacion,
      demanda: this.consulta?.social?.demanda,
      articulacion: this.consulta?.social?.articulacion,
      objeto_informe: this.consulta?.social?.objeto_informe,
      seguimiento: this.consulta?.social?.seguimiento,
    });
  }

  cambiarEstado() {
    if (this.socialForm.disabled) {
      this.socialForm.enable();
    } else {
      this.socialForm.disable();
    }
  }

  existenCambios() {
    let hayCambios = this.socialForm.dirty;
    let observaciones = this.socialForm.value.observaciones;
    if (this.socialForm.value.observaciones !== undefined) {
      if (this.socialForm.value.observaciones !== null) {
        observaciones = this.socialForm.value.observaciones.trim() === '' ? null : this.socialForm.value.observaciones;
      }
    }
    let obra_social = this.socialForm.value.obra_social;
    if (typeof obra_social === 'string') {
      obra_social = this.convertToBoolean(obra_social);
    }

    const derivacion_externaForm = this.convertToBoolean(this.socialForm.value.derivacion_externa);
    let derivacion_externaConsulta = false;
    if (this.consulta?.derivacion_externa) {
      derivacion_externaConsulta = this.consulta?.derivacion_externa;
    }

    if (hayCambios) {
      if (
        // cambios campos comunes
        this.consulta?.chico?.dni === +this.socialForm.value.dni &&
        this.consulta?.institucion?.id === Number(this.socialForm.value.id_institucion) &&
        this.consulta?.observaciones === observaciones &&
        this.consulta?.curso?.id === +this.socialForm.value.id_curso &&
        this.consulta?.turno === this.socialForm.value.turno &&
        this.consulta?.obra_social === obra_social &&
        //  cambios por especialidad
        derivacion_externaConsulta === derivacion_externaForm &&
        this.consulta?.social?.articulacion === this.socialForm.value.articulacion &&
        this.consulta?.social?.demanda === this.socialForm.value.demanda &&
        this.consulta?.social?.objeto_informe === this.socialForm.value.objeto_informe &&
        this.consulta?.social?.seguimiento === this.socialForm.value.seguimiento
      ) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.socialForm.valid && hayCambios);
  }

  convertToBoolean(value: string | boolean): boolean {
    return value === true || value === 'true';
  }

  modificarConsulta() {
    if (this.socialForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios en la consulta?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.loading = true;
          const data = this.setData();
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
    }
  }
}
