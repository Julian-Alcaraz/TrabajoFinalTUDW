import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios } from '../../../../../utils/validadores';

import { InputTextComponent } from '../../../../../components/inputs/input-text.component';
import { Curso } from '../../../../../models/curso.model';
import { CursoService } from '../../../../../services/curso.service';
import { InputSelectEnumComponent } from "../../../../../components/inputs/input-select-enum.component";


@Component({
  selector: 'app-modal-curso',
  standalone: true,
  imports: [InputTextComponent, ReactiveFormsModule, InputSelectEnumComponent],
  templateUrl: './modal-curso.component.html',
  styleUrl: './modal-curso.component.css',
})
export class ModalCursoComponent implements OnInit {
  public curso: Curso | null = null;
  public cursoForm: FormGroup;
  public habilitarModificar = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _cursoService: CursoService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalCursoComponent>,
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
      nivel: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
  }

  ngOnInit() {
    if (this.data !== null) {
      this.curso = this.data.curso;
      this.cursoForm.patchValue({ nombre: this.curso?.nombre , nivel: this.curso?.nivel });
      this.cursoForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.cursoForm.get(input) as FormControl;
  }

  cerrarModalCurso(esEdicion: boolean) {
    this.dialogRef.close(esEdicion);
    this.cursoForm.get('nombre')?.reset();
  }

  cargarCurso() {
    if (this.cursoForm.valid) {
      Swal.fire({
        title: '¿Cargar nuevo curso?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = this.cursoForm.value;
          this._cursoService.cargarCurso(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalCurso(true);
                this.cursoForm.reset();
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

  modificarCurso() {
    if (this.cursoForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const edit = {
            ...(this.curso?.nombre !== this.cursoForm.value.nombre && { nombre: this.cursoForm.value.nombre }),
            ...(this.curso?.nivel !== this.cursoForm.value.nivel && { nivel: this.cursoForm.value.nivel }),
          };
          this._cursoService.modificarCurso(this.curso!.id, edit).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.cerrarModalCurso(true);
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
    let hayCambios = this.cursoForm.dirty;
    if (hayCambios) {
      if (this.curso?.nombre == this.cursoForm.value.nombre && this.curso?.nivel == this.cursoForm.value.nivel) {
        hayCambios = false;
      } else {
        hayCambios = true;
      }
    }
    return !(this.cursoForm.valid && hayCambios);
  }
}
