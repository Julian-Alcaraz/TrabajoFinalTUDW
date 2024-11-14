import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarDni, ValidarSoloLetras, ValidarSoloNumeros, ValidarCampoOpcional } from '../../../../utils/validadores';
import { ChicoService } from '../../../../services/chico.service';
import { Barrio } from '../../../../models/barrio.model';
import { Localidad } from '../../../../models/localidad.model';
import { LocalidadService } from '../../../../services/localidad.service';
import { BarrioService } from '../../../../services/barrio.service';
import { MatDialog } from '@angular/material/dialog';
import { Chico } from '../../../../models/chico.model';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';
import { InputNumberComponent } from '../../../../components/inputs/input-number.component';
import { InputDateComponent } from '../../../../components/inputs/input-date.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { InputRadioComponent } from '../../../../components/inputs/input-radio.component';

@Component({
  selector: 'app-form-chicos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, InputTextComponent, InputNumberComponent, InputDateComponent, InputDateComponent, LoadingComponent, InputRadioComponent],
  templateUrl: './form-chicos.component.html',
  styleUrl: './form-chicos.component.css',
})
export class FormChicosComponent implements OnInit {
  @Input() esFormulario = true;
  @Input() id_chico: number | null = null;

  public searching = false;
  public chicoForm: FormGroup;
  public barrios: Barrio[] = [];
  public localidades: Localidad[] = [];
  public localidadForm: FormGroup;
  public barrioForm: FormGroup;
  public estaEditando = false;
  public chico: Chico | null = null;
  public fechaHaceUnAnio = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  public fechaHoy = new Date();
  public habilitarModificar = false;
  public mensajeDoc=""
  @ViewChild('localidadModal') localidadModal!: TemplateRef<any>;
  @ViewChild('barrioModal') barrioModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _chicoService: ChicoService,
    private _localidadService: LocalidadService,
    private _barrioService: BarrioService,
  ) {
    this.chicoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      dni: ['' /*Math.floor(10000000 + Math.random() * 90000000)*/, [Validators.required, ValidarDni, ValidarSoloNumeros]],
      sexo: ['', [Validators.required]],
      fe_nacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), ValidarSoloNumeros]],
      direccion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255), ValidarCadenaSinEspacios]],
      nombre_padre: ['', ValidarCampoOpcional(Validators.minLength(0), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)],
      nombre_madre: ['', ValidarCampoOpcional(Validators.minLength(0), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)],
      id_barrio: [{ value: '', disabled: this.esFormulario ? false : true }, [Validators.required]],
      id_localidad: ['', [Validators.required]],
    });
    // Nueva localidad
    this.localidadForm = this.fb.group({
      nueva_localidad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
    // Nuevo barrio
    this.barrioForm = this.fb.group({
      nuevo_barrio: ['', [Validators.required, ValidarCadenaSinEspacios]],
      id_localidad: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.esCargaOedicion();
    this.buscarChicoDniIngresado();
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.chicoForm.get(input) as FormControl;
  }

  buscarChicoDniIngresado() {
    this.chicoForm.get('dni')?.valueChanges.subscribe((value) => {
      if (this.chicoForm.get('dni')?.valid) {
        if (!this.esFormulario && this.id_chico) {
          if (this.chico?.dni !== value) {
            this.buscarChicoxDni(value);
          }
        } else {
          this.mensajeDoc= ""
          this.buscarChicoxDni(value);
        }
      }else{
        this.mensajeDoc= ""
      }
    });
  }
  buscarChicoxDni(dni: number) {
    this._chicoService.obtenerChicoxDni(dni).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.chicoForm.get('dni')?.setErrors({ invalidDni: true });
          this.habilitarModificar=true
          this.mensajeDoc= "Documento ya ingresado en otro chico."
        } else {
          this.chicoForm.get('dni')?.setErrors(null);
          this.mensajeDoc= ""
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  onChangeBarrio() {
    const idBarrio = this.chicoForm.get('id_barrio')?.value;
    if (idBarrio === 'new') {
      this.abrirModalBarrio();
      this.barrioForm.get('id_localidad')?.setValue(this.chicoForm.get('id_localidad')?.value);
    }
  }

  onChangeLocalidad() {
    const idLocalidad = this.chicoForm.get('id_localidad')?.value;
    if (idLocalidad && idLocalidad !== 'new' && idLocalidad !== '') {
      this.obtenerBarriosXLocalidad(idLocalidad);
      this.chicoForm.get('id_barrio')?.enable();
    } else if (idLocalidad === 'new') {
      this.abrirModalLocalidad();
      this.barrios = [];
    }
  }

  obtenerLocalidades(): any {
    this._localidadService.obtenerLocalidades().subscribe({
      next: (response: any) => {
        this.localidades = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  esCargaOedicion() {
    this.searching = true;
    if (!this.esFormulario && this.id_chico) {
      this._chicoService.obtenerChicoxId(this.id_chico).subscribe({
        next: (response: any) => {
          if (response.data) {
            this.chico = response.data;
            this.completarDatosForm()
            this.obtenerBarriosXLocalidad(this.chicoForm.get('id_localidad')?.value);
            this.chicoForm.disable();
            this.searching = false;
            this.chicoForm.valueChanges.subscribe({
              next: () => {
                this.habilitarModificar = this.existenCambios();
              },
            });
          }
        },
      });
    }
  }

  completarDatosForm(){
    const stringFecha = String(this.chico?.fe_nacimiento) + 'T12:00:00';
    this.chicoForm.patchValue({
      nombre: this.chico?.nombre,
      apellido: this.chico?.apellido,
      dni: this.chico?.dni,
      sexo: this.chico?.sexo,
      fe_nacimiento: new Date(stringFecha), // Problema
      direccion: this.chico?.direccion,
      telefono: this.chico?.telefono,
      nombre_padre: this.chico?.nombre_padre,
      nombre_madre: this.chico?.nombre_madre,
      id_barrio: this.chico?.barrio?.id,
      id_localidad: this.chico?.barrio?.localidad?.id,
    });
  }
  obtenerBarriosXLocalidad(idLocalidad: string) {
    this._localidadService.obtenerBarriosXLocalidad(idLocalidad).subscribe({
      next: (response: any) => {
        this.barrios = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  cargarLocalidad() {
    if (this.localidadForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva localidad?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = {
            nombre: this.localidadForm.value.nueva_localidad,
          };
          this._localidadService.cargarLocalidad(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerraModalLocalidad();
                this.obtenerLocalidades();
                this.localidadForm.get('id_localidad')?.setValue('');
                // Aca se podria poner la localidad recien creada como seleccionada
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

  cargarBarrio() {
    if (this.barrioForm.valid) {
      Swal.fire({
        title: '¿Cargar nuevo barrio?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = {
            nombre: this.barrioForm.value.nuevo_barrio,
            id_localidad: parseInt(this.barrioForm.value.id_localidad),
          };
          this._barrioService.cargarBarrio(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.barrioForm.get('nuevo_barrio')?.reset();
                this.barrioForm.get('id_localidad')?.reset();
                this.chicoForm.get('id_barrio')?.reset();
                // Aca se podria poner en el input de barrio el barrio recien creado
                this.obtenerBarriosXLocalidad(this.chicoForm.value.id_localidad);
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

  activarFormulario() {
    this.chicoForm.enable();
    this.estaEditando = true;
  }

  desactivarFormulario() {
    this.chicoForm.disable();
    this.completarDatosForm()
    this.estaEditando = false;
  }

  editarChico() {
    if (this.chico) {
      Swal.fire({
        title: '¿Modificar chico?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed && this.chico) {
          const stringFechaActual = String(new Date(String(this.chico?.fe_nacimiento) + 'T12:00:00'));
          const stringFechaMod = String(this.chicoForm.value.fe_nacimiento);
          const valorFecha = this.chicoForm.value.fe_nacimiento.toISOString();
          const data = {
            ...(this.chico?.dni !== this.chicoForm.value.dni && { dni: this.chicoForm.value.dni }),
            ...(this.chico?.sexo !== this.chicoForm.value.sexo && { sexo: this.chicoForm.value.sexo }),
            ...(this.chico?.nombre !== this.chicoForm.value.nombre && { nombre: this.chicoForm.value.nombre }),
            ...(this.chico?.apellido !== this.chicoForm.value.apellido && { apellido: this.chicoForm.value.apellido }),
            ...(this.chico?.direccion !== this.chicoForm.value.direccion && { direccion: this.chicoForm.value.direccion }),
            ...(this.chico?.telefono !== this.chicoForm.value.telefono && { telefono: this.chicoForm.value.telefono }),
            ...(this.chico?.nombre_padre !== this.chicoForm.value.nombre_padre && { nombre_padre: this.chicoForm.value.nombre_padre }),
            ...(this.chico?.nombre_madre !== this.chicoForm.value.nombre_madre && { nombre_madre: this.chicoForm.value.nombre_madre }),
            ...(this.chico?.barrio?.localidad?.id !== this.chicoForm.value.id_localidad && { id_localidad: this.chicoForm.value.id_localidad }),
            ...(this.chico?.barrio?.id !== this.chicoForm.value.id_barrio && { id_barrio: this.chicoForm.value.id_barrio }),
            ...(stringFechaActual !== stringFechaMod && { fe_nacimiento: valorFecha }),
          };
          if (!data.nombre_madre) delete data.nombre_madre;
          if (!data.nombre_padre) delete data.nombre_padre;
          this._chicoService.modificarChico(this.chico.id, data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
              } else {
                MostrarNotificacion.mensajeError(this.snackBar, response.message);
              }
            },
            error: (err: any) => {
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
        }
      });
    } else {
      MostrarNotificacion.mensajeError(this.snackBar, 'No se esta editando ningun chico.');
    }
  }

  cargarChico() {
    console.log('Formulario válido:', this.chicoForm.valid);
    if (this.chicoForm.valid) {
      Swal.fire({
        title: '¿Cargar nuevo chico?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = this.chicoForm.value;
          if (!data.nombre_madre) delete data.nombre_madre;
          if (!data.nombre_padre) delete data.nombre_padre;
          delete data.id_localidad;
          data.id_barrio = parseInt(data.id_barrio);
          data.telefono = data.telefono.toString();
          this._chicoService.cargarChico(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.chicoForm.reset();
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

  existenCambios() {
    let hayCambios = this.chicoForm.dirty;
    if (hayCambios) {
      if (this.chico?.apellido == this.chicoForm.value.apellido && this.chico?.nombre == this.chicoForm.value.nombre && this.chico?.dni == this.chicoForm.value.dni && this.chico?.direccion == this.chicoForm.value.direccion && this.chico?.nombre_madre == this.chicoForm.value.nombre_madre && this.chico?.nombre_padre == this.chicoForm.value.nombre_padre && this.chico?.telefono == this.chicoForm.value.telefono && this.chico?.barrio?.id == this.chicoForm.value.id_barrio && this.chico?.barrio?.localidad?.id == this.chicoForm.value.id_localidad && this.chico?.sexo == this.chicoForm.value.sexo && this.formatearFecha(this.chicoForm.value.fe_nacimiento) === String(this.chico?.fe_nacimiento)) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.chicoForm.valid && hayCambios);
  }

  formatearFecha(fecha: any) {
    const aux = new Date(String(fecha));
    aux.setHours(0, 0, 0, 0); // Establecer hora en 00:00:00
    return `${aux.getFullYear()}-${(aux.getMonth() + 1).toString().padStart(2, '0')}-${aux.getDate().toString().padStart(2, '0')}`;
  }

  // Modal Barrio

  abrirModalBarrio() {
    const dialogRef = this._dialog.open(this.barrioModal, { minWidth: '40%' });
    dialogRef.afterClosed().subscribe(() => {
      this.barrioForm.reset();
    });
  }

  cerraModalBarrio() {
    this._dialog.closeAll();
    this.chicoForm.get('id_barrio')?.setValue('');
  }

  // Modal localidad

  abrirModalLocalidad() {
    const dialogRef = this._dialog.open(this.localidadModal, { minWidth: '40%' });
    dialogRef.afterClosed().subscribe(() => {
      this.localidadForm.reset();
    });
  }

  cerraModalLocalidad() {
    this._dialog.closeAll();
    this.chicoForm.get('id_localidad')?.setValue('');
  }
}
