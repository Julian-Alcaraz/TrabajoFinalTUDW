import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarDni, ValidarSexo, ValidarSoloLetras, ValidarSoloNumeros, ValidarCampoOpcional } from '../../../../utils/validadores';
import { ChicoService } from '../../../../services/chico.service';
import { Barrio } from '../../../../models/barrio.model';
import { Localidad } from '../../../../models/localidad.model';
import { LocalidadService } from '../../../../services/localidad.service';
import { BarrioService } from '../../../../services/barrio.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form-chicos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-chicos.component.html',
  styleUrl: './form-chicos.component.css',
})
export class FormChicosComponent implements OnInit {
  public chicoForm: FormGroup;
  public hoy = new Date();
  public barrios: Barrio[] = [];
  public localidades: Localidad[] = [];
  public localidadForm: FormGroup;
  public barrioForm: FormGroup;

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
    // Valores de prueba
    // Hacer un trim o algo, este es un string valido: "          a                Juan"
    // Formulario para crear un nuevo chico
    this.chicoForm = this.fb.group({
      nombre: ['Juan', [Validators.required, Validators.minLength(3), Validators.maxLength(50), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      apellido: ['Pérez', [Validators.required, Validators.minLength(3), Validators.maxLength(50), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      dni: [Math.floor(10000000 + Math.random() * 90000000), [Validators.required, ValidarDni, ValidarSoloNumeros]],
      sexo: ['Masculino', [Validators.required, ValidarSexo]],
      fe_nacimiento: ['2000-07-07', Validators.required],
      telefono: ['123456789', [Validators.required, Validators.minLength(1), Validators.maxLength(50), ValidarSoloNumeros]],
      direccion: ['Calle Falsa 123', [Validators.required, Validators.minLength(1), Validators.maxLength(255), ValidarCadenaSinEspacios]],
      nombre_padre: ['', ValidarCampoOpcional(Validators.minLength(0), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)],
      nombre_madre: ['', ValidarCampoOpcional(Validators.minLength(0), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)],
      id_barrio: [{ value: '', disabled: true }, [Validators.required]],
      id_localidad: ['', [Validators.required]],
    });

    // Formulario para crear una nueva localidad
    this.localidadForm = this.fb.group({
      nueva_localidad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });

    // Formulario para crear un nuevo barrio
    this.barrioForm = this.fb.group({
      nuevo_barrio: ['', [Validators.required, ValidarCadenaSinEspacios]],
      id_localidad: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
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
    if (this.localidadForm.get('nueva_localidad')) {
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
    if (this.barrioForm.get('nuevo_barrio')) {
      // Cambiar a valid form....!!!!!!!!!!!!!!!!!!!!!
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
          data.id_barrio = parseInt(data.id_barrio);
          data.telefono = data.telefono.toString();
          // Podria sacarse creo:
          if (!data.nombre_madre) {
            data.nombre_madre = null;
          }
          if (!data.nombre_padre) {
            data.nombre_padre = null;
          }
          delete data.id_localidad;
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

  // Modal Barrio

  abrirModalBarrio() {
    const dialogRef = this._dialog.open(this.barrioModal, { width: '40%' });
    dialogRef.afterClosed().subscribe(() => {
      this.barrioForm.reset();
    });
  }

  cerraModalBarrio() { // cerrarModalBarrio
    this._dialog.closeAll();
    this.chicoForm.get('id_barrio')?.setValue('');
  }

  // Modal localidad

  abrirModalLocalidad() {
    const dialogRef = this._dialog.open(this.localidadModal, { width: '40%' });
    dialogRef.afterClosed().subscribe(() => {
      this.localidadForm.reset();
    });
  }

  cerraModalLocalidad() {
    this._dialog.closeAll();
    this.chicoForm.get('id_localidad')?.setValue('');
  }
}