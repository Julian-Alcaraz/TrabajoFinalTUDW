import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { Barrio } from '../../../../models/barrio.model';
import { ValidarCadenaSinEspacios } from '../../../../utils/validadores';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';
import { BarrioService } from '../../../../services/barrio.service';
import { InputSelectComponent } from '../../../../components/inputs/input-select.component';
import { Localidad } from '../../../../models/localidad.model';
import { LocalidadService } from '../../../../services/localidad.service';

@Component({
  selector: 'app-modal-barrio',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule, InputSelectComponent],
  templateUrl: './modal-barrio.component.html',
  styleUrl: './modal-barrio.component.css',
})
export class ModalBarrioComponent implements OnInit {
  public localidades!: Localidad[];
  public barrio: Barrio | null = null;
  public barrioForm: FormGroup;
  public habilitarModificar = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { barrio: Barrio },
    private _barrioService: BarrioService,
    private _localidadService: LocalidadService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalBarrioComponent>,
  ) {
    this.barrioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      id_localidad: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.data) {
      this.barrio = this.data.barrio;
      this.barrioForm.patchValue({ nombre: this.barrio?.nombre, id_localidad: this.barrio?.localidad?.id });
      this.barrioForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
    this.obtenerLocalidades();
  }

  obtenerLocalidades() {
    this._localidadService.obtenerTodasLocalidades().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.localidades = response.data;
        }
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.barrioForm.get(input) as FormControl;
  }

  cerrarModalBarrio(esEdicion: boolean) {
    this.dialogRef.close(esEdicion);
    this.barrioForm.reset();
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
            nombre: this.barrioForm.value.nombre,
            id_localidad: parseInt(this.barrioForm.value.id_localidad),
          };
          this._barrioService.cargarBarrio(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalBarrio(true);
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

  modificarBarrio() {
    if (this.barrioForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const edit = {
            ...(this.barrio?.nombre !== this.barrioForm.value.nombre && { nombre: this.barrioForm.value.nombre }),
            ...(this.barrio?.localidad?.id !== this.barrioForm.value.id_localidad && { id_localidad: parseInt(this.barrioForm.value.id_localidad) }),
          };
          this._barrioService.modificarBarrio(this.barrio!.id, edit).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalBarrio(true);
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
    }
  }

  existenCambios() {
    let hayCambios = this.barrioForm.dirty;
    if (hayCambios) {
      if (this.barrio?.nombre == this.barrioForm.value.nombre && this.barrio?.localidad?.id == this.barrioForm.value.id_localidad) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.barrioForm.valid && hayCambios);
  }
}
