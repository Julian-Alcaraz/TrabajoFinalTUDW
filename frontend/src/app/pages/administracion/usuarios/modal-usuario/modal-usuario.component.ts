import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { Usuario } from '@models/usuario.model';
import { Rol } from '@models/rol.model';
import { RolesService } from '@services/roles.service';
import { UsuarioService } from '@services/usuario.service';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-usuario.component.html',
})
export class ModalUsuarioComponent implements OnInit {
  public roles!: Rol[];
  public usuario!: Usuario;
  public usuarioForm: FormGroup;
  public searching = false;
  public habilitarModificar = true;
  public selectCheckbox = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario },
    private _usuarioService: UsuarioService,
    private _rolesService: RolesService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalUsuarioComponent>,
  ) {
    this.usuarioForm = this.fb.group({
      roles_ids: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.usuario = this.data.usuario;
      const rolesArray: FormArray = this.usuarioForm.get('roles_ids') as FormArray;
      this.usuario?.roles?.forEach((rol) => {
        rolesArray.push(this.fb.control(rol.id));
      });
      this.usuarioForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
    this.obtenerRoles();
  }

  onCheckboxChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const rolesArray: FormArray = this.usuarioForm.get('roles_ids') as FormArray;
    if (inputElement.checked) {
      rolesArray.push(this.fb.control(+inputElement.value));
    } else {
      const index = rolesArray.controls.findIndex((control) => +control.value === +inputElement.value);
      if (index !== -1) {
        rolesArray.removeAt(index);
      }
    }
    this.selectCheckbox = this.usuarioForm.get('roles_ids')?.value.length === 0;
  }

  tieneElRol(usuario: Usuario, idRol: number): boolean {
    return usuario?.roles?.some((rolSeleccionado) => rolSeleccionado.id === idRol) || false;
  }

  cerrarModalUsuario(actualizar: boolean) {
    this.dialogRef.close(actualizar);
    this.usuarioForm.reset();
  }

  existenCambios() {
    const hayCambios = this.usuarioForm.dirty;
    return this.usuarioForm.valid && hayCambios;
  }

  obtenerRoles() {
    this.searching = true;
    this._rolesService.obtenerRoles().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.roles = response.data;
        }
        this.searching = false;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
        this.searching = false;
      },
    });
  }
  modificarRoles() {
    if (this.usuarioForm.valid) {
      Swal.fire({
        title: '¿Confirmar cambios?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const rolesOrdenados = this.usuarioForm.value.roles_ids.sort();
          const roles = rolesOrdenados.map((idRol: string) => parseInt(idRol));
          this._usuarioService.administrarRoles(this.usuario!.id, roles).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, `Roles modificados.`);
              } else {
                MostrarNotificacion.mensajeError(this.snackBar, response.message);
              }
            },
            error: (err: any) => {
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
          // Cerrar el modal
          this.cerrarModalUsuario(true);
        }
      });
    }
  }
}
