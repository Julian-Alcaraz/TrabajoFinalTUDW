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
import { InputNumberComponent } from '../../../../components/inputs/input-number.component';

@Component({
  selector: 'app-nueva-prevencion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatosMedicoComponent, MatFormFieldModule, MatInputModule, CamposComunesComponent, InputTextareaComponent, LoadingComponent, InputSelectEnumComponent, InputNumberComponent],
  templateUrl: './nueva-prevencion.component.html',
})
export class NuevaPrevencionComponent implements OnInit {
  @Input() consulta: Consulta | null = null;
  @Input() editar = true;
  @Output() modificoConsulta = new EventEmitter<any>();
  habilitarModificar = false;
  loading = false;
  public prevencionForm: FormGroup;
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

    this.prevencionForm = this.fb.group({
      // Campos comunes
      observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios)]],
      // Campos prevencion
      otra_problematica: ['', Validators.required],
      derivacion_externa: ['', [Validators.required]],

      edad_inicio_consumo: ['', [Validators.required]],
      motivo_consumo: ['', [Validators.required]],
      frecuencia: ['', [Validators.required]],
      consumo_problematico: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.consulta) {
      // llenar form y deshabilitarlo
      this.completarCampos();
      this.prevencionForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
    this.listenOtraProblematica();
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.prevencionForm.get(input) as FormControl;
  }
  get valueProblematica() {
    return this.prevencionForm.get('otra_problematica')?.value;
  }
  recibirChico(chicoRecibido: Chico | null) {
    this.chico = chicoRecibido;
  }
  listenOtraProblematica() {
    this.prevencionForm.get('otra_problematica')?.valueChanges.subscribe((value: any) => {
      if (value === 'Consumo problematico') {
        // setear como estan los ultimos 4 controls
        if (!this.consulta) {
          this.prevencionForm.patchValue({
            edad_inicio_consumo: '',
            motivo_consumo: '',
            frecuencia: '',
            consumo_problematico: '',
          });
          this.prevencionForm.get('edad_inicio_consumo')?.addValidators(Validators.required);
        }
      } else {
        if (!this.consulta) {
          this.prevencionForm.get('edad_inicio_consumo')?.removeValidators(Validators.required);
          // setear valores por defecto
          this.prevencionForm.patchValue({
            edad_inicio_consumo: null,
            motivo_consumo: 'Otro',
            frecuencia: 'Otro',
            consumo_problematico: 'Otra',
          });
        }
      }
    });
  }

  setData() {
    const formValues = this.prevencionForm.value;
    formValues.obra_social = formValues.obra_social === 'true';
    formValues.derivacion_externa = formValues.derivacion_externa === 'true';

    delete formValues.dni;
    const { turno, edad, obra_social, observaciones, id_institucion, id_curso, id_chico, derivacion_externa, ...prevencionValues } = formValues;
    const data = {
      type: 'Prevencion',
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
      prevencion: {
        ...prevencionValues,
      },
    };
    if (data.otra_problematica !== 'Consumo problematico') {
      delete data.prevencion.motivo_consumo;
      delete data.prevencion.edad_inicio_consumo;
      delete data.prevencion.frecuencia;
      delete data.prevencion.consumo_problematico;
    }
    return data;
  }

  enviarFormulario() {
    if (this.prevencionForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva consulta prevención?',
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
                this.prevencionForm.reset();
                this.prevencionForm.get('id_institucion')?.setValue('');
                this.prevencionForm.get('id_curso')?.setValue('');
                this.prevencionForm.get('turno')?.setValue('');
                this.prevencionForm.get('obra_social')?.setValue('');

                this.prevencionForm.get('edad_inicio_consumo')?.setValue('');
                this.prevencionForm.get('motivo_consumo')?.setValue('');
                this.prevencionForm.get('frecuencia')?.setValue('');
                this.prevencionForm.get('otra_problematica')?.setValue('');
                this.prevencionForm.get('consumo_problematico')?.setValue('');
                this.prevencionForm.get('derivacion_externa')?.setValue('');
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
      this.prevencionForm.markAllAsTouched();
    }
  }

  completarCampos() {
    const derivacion = this.consulta?.derivacion_externa ? true : false;
    this.prevencionForm.patchValue({
      observaciones: this.consulta?.observaciones,
      derivacion_externa: derivacion,
      edad_inicio_consumo: this.consulta?.prevencion?.edad_inicio_consumo,
      motivo_consumo: this.consulta?.prevencion?.motivo_consumo,
      frecuencia: this.consulta?.prevencion?.frecuencia,
      consumo_problematico: this.consulta?.prevencion?.consumo_problematico,
      otra_problematica: this.consulta?.prevencion?.otra_problematica,
    });
  }

  cambiarEstado() {
    if (this.prevencionForm.disabled) {
      this.prevencionForm.enable();
    } else {
      this.prevencionForm.disable();
    }
  }

  existenCambios() {
    let hayCambios = this.prevencionForm.dirty;
    let observaciones = this.prevencionForm.value.observaciones;
    if (this.prevencionForm.value.observaciones !== undefined) {
      if (this.prevencionForm.value.observaciones !== null) {
        observaciones = this.prevencionForm.value.observaciones.trim() === '' ? null : this.prevencionForm.value.observaciones;
      }
    }
    let obra_social = this.prevencionForm.value.obra_social;
    if (typeof obra_social === 'string') {
      obra_social = this.convertToBoolean(obra_social);
    }

    const derivacion_externaForm = this.convertToBoolean(this.prevencionForm.value.derivacion_externa);
    let derivacion_externaConsulta = false;
    if (this.consulta?.derivacion_externa) {
      derivacion_externaConsulta = this.consulta?.derivacion_externa;
    }

    if (hayCambios) {
      if (
        // cambios campos comunes
        this.consulta?.chico?.dni === +this.prevencionForm.value.dni &&
        this.consulta?.institucion?.id === Number(this.prevencionForm.value.id_institucion) &&
        this.consulta?.observaciones === observaciones &&
        this.consulta?.curso?.id === +this.prevencionForm.value.id_curso &&
        this.consulta?.turno === this.prevencionForm.value.turno &&
        this.consulta?.obra_social === obra_social &&
        //  cambios por especialidad
        derivacion_externaConsulta === derivacion_externaForm &&
        this.consulta?.prevencion?.edad_inicio_consumo === this.prevencionForm.value.edad_inicio_consumo &&
        this.consulta?.prevencion?.motivo_consumo === this.prevencionForm.value.motivo_consumo &&
        this.consulta?.prevencion?.frecuencia === this.prevencionForm.value.frecuencia &&
        this.consulta?.prevencion?.consumo_problematico === this.prevencionForm.value.consumo_problematico &&
        this.consulta?.prevencion?.otra_problematica === this.prevencionForm.value.otra_problematica
      ) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.prevencionForm.valid && hayCambios);
  }

  convertToBoolean(value: string | boolean): boolean {
    return value === true || value === 'true';
  }

  modificarConsulta() {
    if (this.prevencionForm.valid) {
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
