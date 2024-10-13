import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarDni, ValidarSexo, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
import { ChicoService } from '../../../../services/chico.service';
import { Barrio } from '../../../../models/barrio.model';
import { Localidad } from '../../../../models/localidad.model';
import { LocalidadService } from '../../../../services/localidad.service';

@Component({
  selector: 'app-form-chicos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './form-chicos.component.html',
  styleUrl: './form-chicos.component.css',
})
export class FormChicosComponent {
  public chicoForm: FormGroup;
  public hoy = new Date();
  public barrios: Barrio[] = [];
  public localidades: Localidad[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private _chicoService: ChicoService,
    private _localidadService: LocalidadService,
  ) {
    // Valores de prueba
    /*
      Hacer un trim o algo, este es un string valido: "                          Juan"
    */
    this.chicoForm = this.fb.group({
      nombre: ['Juan', [Validators.required, Validators.minLength(3), Validators.maxLength(30), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      apellido: ['Pérez', [Validators.required, Validators.minLength(3), Validators.maxLength(40), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      dni: [Math.floor(10000000 + Math.random() * 90000000), [Validators.required, ValidarDni, ValidarSoloNumeros]],
      sexo: ['', [Validators.required, ValidarSexo]],
      fe_nacimiento: ['2000-07-07', Validators.required], // Podria validarse mejor la fecha!!!!!!!
      telefono: ['123456789', [Validators.required, ValidarSoloNumeros]],
      direccion: ['Calle Falsa 123', [Validators.required, ValidarCadenaSinEspacios]],
      nombre_padre: ['Carlos Pérez', [Validators.required, Validators.minLength(3), Validators.maxLength(30), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      nombre_madre: ['Ana García', [Validators.required, Validators.minLength(3), Validators.maxLength(30), ValidarCadenaSinEspacios, ValidarSoloLetras]],
      id_barrio: [1, [Validators.required]], // Quiza falten validaciones
      id_localidad: [1, [Validators.required]], // Quiza falten validaciones
    });
  }

  ngOnInit(): void {
    this.obtenerLocalidades();
    this.chicoForm.get('id_localidad')?.valueChanges.subscribe((idLocalidad) => {
      if (idLocalidad) {
        this.obtenerBarriosXLocalidad(idLocalidad);
      } else {
        this.barrios = [];
      }
    });
  }

  obtenerLocalidades() {
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

  cargarChico() {
    console.log('Formulario válido:', this.chicoForm.valid);
    if (this.chicoForm.valid) {
      console.log('Formulario valido, cargando chico...');
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
              console.log('Error al cargar chico');
            },
          });
        }
      });
    }
  }
}
