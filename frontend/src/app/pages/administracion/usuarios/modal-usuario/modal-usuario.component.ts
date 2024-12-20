import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { Usuario } from '../../../../models/usuario.model';
import { Rol } from '../../../../models/rol.model';
import { RolesService } from '../../../../services/roles.service';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
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

  trackById(index: number, rol: Rol): number {
    return rol.id;
  }

  tieneElRol(usuario: Usuario, idRol: number): boolean {
    return usuario?.roles?.some((rolSeleccionado) => rolSeleccionado.id === idRol) || false;
  }

  cerrarModalUsuario(actualizar: boolean) {
    this.dialogRef.close(actualizar);
    this.usuarioForm.reset();
  }

  onCheckboxChange(e: any) {
    const rolesArray: FormArray = this.usuarioForm.get('roles_ids') as FormArray;
    if (e.target.checked) {
      rolesArray.push(this.fb.control(e.target.value));
    } else {
      const index = rolesArray.controls.findIndex((x) => x.value === e.target.value);
      rolesArray.removeAt(index);
    }
    if (this.usuarioForm.get('roles_ids')?.value.length == 0) {
      this.selectCheckbox = true;
    } else {
      this.selectCheckbox = false;
    }
  }

  existenCambios() {
    const hayCambios = this.usuarioForm.dirty;
    // if (hayCambios) {
    //   if (this.barrio?.nombre == this.barrioForm.value.nombre && this.barrio?.localidad?.id == this.barrioForm.value.id_localidad) {
    //     hayCambios = false;
    //   } else {
    //     hayCambios = true;
    //   }
    // }
    return (this.usuarioForm.valid && hayCambios);
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
          // Ordenar el arreglo de ids
          const rolesOrdenados = this.usuarioForm.value.roles_ids.sort();
          // Obtener los IDs de roles seleccionados actualmente
          const nuevosRoles = rolesOrdenados.map((idRol: string) => parseInt(idRol));
          // Obtener los IDs de roles que el usuario tenía previamente
          const rolesAnteriores = this.usuario?.roles?.map((rol) => rol.id);
          // Identificar roles a agregar (están en nuevosRoles pero no en rolesAnteriores)
          const rolesAAgregar = nuevosRoles.filter((idRol: number) => !rolesAnteriores?.includes(idRol));
          // Identificar roles a eliminar (están en rolesAnteriores pero no en nuevosRoles)
          const rolesAEliminar = rolesAnteriores?.filter((idRol) => !nuevosRoles.includes(idRol));
          // Agregar roles nuevos
          rolesAAgregar.forEach((idRol: number) => {
            this._usuarioService.agregarRolDeUsuario(this.usuario!.id, idRol).subscribe({
              next: (response: any) => {
                if (response.success) {
                  MostrarNotificacion.mensajeExito(this.snackBar, `Rol ${idRol} agregado correctamente.`);
                } else {
                  MostrarNotificacion.mensajeError(this.snackBar, response.message);
                }
              },
              error: (err: any) => {
                MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
              },
            });
          });
          // Eliminar roles deseleccionados
          rolesAEliminar?.forEach((idRol) => {
            this._usuarioService.eliminarRolDeUsuario(this.usuario!.id, idRol).subscribe({
              next: (response: any) => {
                if (response.success) {
                  MostrarNotificacion.mensajeExito(this.snackBar, `Rol ${idRol} eliminado correctamente.`);
                } else {
                  MostrarNotificacion.mensajeError(this.snackBar, response.message);
                }
              },
              error: (err: any) => {
                MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
              },
            });
          });
          // Cerrar el modal
          this.cerrarModalUsuario(true);
        }
      });
    }
  }
}
