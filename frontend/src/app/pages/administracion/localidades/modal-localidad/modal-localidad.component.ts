import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { LocalidadService } from '../../../../services/localidad.service';
import { ValidarCadenaSinEspacios } from '../../../../utils/validadores';
import { Localidad } from '../../../../models/localidad.model';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';

@Component({
  selector: 'app-modal-localidad',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule],
  templateUrl: './modal-localidad.component.html',
  styleUrl: './modal-localidad.component.css',
})
export class ModalLocalidadComponent implements OnInit {
  public localidad: Localidad | null = null;
  public localidadForm: FormGroup;
  public habilitarModificar = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _localidadService: LocalidadService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalLocalidadComponent>,
  ) {
    this.localidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
  }

  ngOnInit() {
    if (this.data !== null) {
      this.localidad = this.data.localidad;
      this.localidadForm.patchValue({ nombre: this.localidad?.nombre });
      this.localidadForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.localidadForm.get(input) as FormControl;
  }

  cerrarModalLocalidad(esEdicion: boolean) {
    this.dialogRef.close(esEdicion);
    this.localidadForm.get('nombre')?.reset();
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
          const data = this.localidadForm.value;
          this._localidadService.cargarLocalidad(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalLocalidad(true);
                this.localidadForm.get('id_localidad')?.reset();
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

  modificarLocalidad() {
    if (this.localidadForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const edit = {
            nombre: this.localidadForm.value.nombre,
          };
          this._localidadService.modificarLocalidad(this.localidad!.id, edit).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalLocalidad(true);
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
    let hayCambios = this.localidadForm.dirty;
    if (hayCambios) {
      if (this.localidad?.nombre == this.localidadForm.value.nombre) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.localidadForm.valid && hayCambios);
  }
}
