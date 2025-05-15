import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { Usuario } from '@models/usuario.model';
import { Rol } from '@models/rol.model';
import { RolesService } from '@services/roles.service';
import { UsuarioService } from '@services/usuario.service';
import { InputSelectEnumComponent } from '@app/components/inputs/input-select-enum.component';
import { LoadingComponent } from '@app/components/loading/loading.component';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputSelectEnumComponent, LoadingComponent],
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
      roles_ids: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.usuario = this.data.usuario;
      if (this.usuario?.roles) {
        this.usuarioForm.value.roles_ids = this.usuario?.roles[0];
      }
      this.usuarioForm.valueChanges.subscribe({
        next: () => {
          this.habilitarModificar = this.existenCambios();
        },
      });
    }
    this.obtenerRoles();
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.usuarioForm.get(input) as FormControl;
  }

  get rolesNombres() {
    return this.roles.map((rol: Rol) => rol.nombre);
  }

  get rolesIds() {
    return this.roles.map((rol: Rol) => rol.id);
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
          const roles = [Number(this.usuarioForm.value.roles_ids)];
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
