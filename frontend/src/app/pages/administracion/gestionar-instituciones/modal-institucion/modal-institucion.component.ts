import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios } from '../../../../utils/validadores';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';
import { Institucion } from '../../../../models/institucion.model';
import { InstitucionService } from '../../../../services/institucion.service';
import { ModalLocalidadComponent } from '../../gestionar-localidades/components/modal-localidad/modal-localidad.component';
import { InputSelectEnumComponent } from '../../../../components/inputs/input-select-enum.component';

@Component({
  selector: 'app-modal-institucion',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule, InputSelectEnumComponent],
  templateUrl: './modal-institucion.component.html',
  styleUrl: './modal-institucion.component.css',
})
export class ModalInstitucionComponent implements OnInit {
  public institucion: Institucion | null = null;
  public institucionForm: FormGroup;
  public habilitarModificar = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _institucionService: InstitucionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalLocalidadComponent>,
  ) {
    this.institucionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      tipo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.data !== null) {
      this.institucion = this.data.institucion;
      this.institucionForm.patchValue({ nombre: this.institucion?.nombre, tipo: this.institucion?.tipo });
      this.institucionForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.institucionForm.get(input) as FormControl;
  }

  cerrarModalInstitucion(esEdicion: boolean) {
    this.dialogRef.close(esEdicion);
    this.institucionForm.reset();
  }

  cargarInstitucion() {
    if (this.institucionForm.valid) {
      Swal.fire({
        title: '¿Cargar nueva institucion?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = this.institucionForm.value;
          this._institucionService.cargarInstitucion(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalInstitucion(true);
                this.institucionForm.reset();
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

  modificarInstitucion() {
    if (this.institucionForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const edit = {
            ...(this.institucion?.nombre !== this.institucionForm.value.nombre && { nombre: this.institucionForm.value.nombre }),
            ...(this.institucion?.tipo !== this.institucionForm.value.tipo && { tipo: this.institucionForm.value.tipo }),
          };
          this._institucionService.modificarInstitucion(this.institucion!.id, edit).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalInstitucion(true);
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
    let hayCambios = this.institucionForm.dirty;
    if (hayCambios) {
      if (this.institucion?.nombre == this.institucionForm.value.nombre && this.institucion?.tipo == this.institucionForm.value.tipo) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.institucionForm.valid && hayCambios);
  }
}
