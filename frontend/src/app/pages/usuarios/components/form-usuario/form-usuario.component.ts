import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { ValidarCadenaSinEspacios, ValidarDni, ValidarEmail } from '../../../../utils/validadores';
import { UsuarioService } from '../../../../services/usuario.service';
import { RolesService } from '../../../../services/roles.service';
import { Rol } from '../../../../models/rol.model';
import { Usuario } from '../../../../models/usuario.model';
import { SessionService } from '../../../../services/session.service';
import { InputTextComponent } from '../../../../components/inputs/input-text.component';
import { InputNumberComponent } from '../../../../components/inputs/input-number.component';
import { InputDateComponent } from '../../../../components/inputs/input-date.component';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, InputTextComponent, InputNumberComponent, InputDateComponent],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css',
})
export class FormUsuarioComponent implements OnInit {
  @Input() esFormulario = true;
  @Input() usuario: Usuario | null = null;

  public userForm: FormGroup;
  public hoy = new Date();
  public roles: Rol[] = [];
  public selectCheckbox = true;
  public estaEditando = false;
  public usuarioActual: Usuario | null = null;
  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _rolesService: RolesService,
    private snackBar: MatSnackBar,
    private _sessionService: SessionService,
  ) {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), ValidarCadenaSinEspacios]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), ValidarCadenaSinEspacios]],
      dni: ['', [Validators.required, ValidarDni]],
      email: ['', [Validators.required, ValidarEmail, ValidarCadenaSinEspacios]],
      fe_nacimiento: ['', [Validators.required]],
      roles_ids: this.fb.array([], Validators.required), // FormArray para role
    });
  }

  ngOnInit(): void {
    this.obtenerRoles();
    this.esCargaOedicion();
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.userForm.get(input) as FormControl;
  }

  obtenerRoles() {
    this._rolesService.obtenerRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data;
      },
      error: (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    });
  }

  esCargaOedicion() {
    if (!this.esFormulario && this.usuario) {
      this._usuarioService.obtenerUsuarioxId(this.usuario.id).subscribe({
        next: (response: any) => {
          this.userForm.patchValue({
            roles_ids: this.usuario?.roles_ids, // FormArray para role
          });
          if (response.data) {
            this.usuarioActual = response.data;
          }
          const stringFecha = String(this.usuarioActual?.fe_nacimiento) + 'T12:00:00';
          this.userForm.patchValue({
            nombre: this.usuarioActual?.nombre,
            apellido: this.usuarioActual?.apellido,
            dni: this.usuarioActual?.dni,
            email: this.usuarioActual?.email,
            fe_nacimiento: new Date(stringFecha), //problmea
          });
          this.userForm.disable();
        },
      });
    }
  }

  onCheckboxChange(e: any) {
    const rolesArray: FormArray = this.userForm.get('roles_ids') as FormArray;
    if (e.target.checked) {
      rolesArray.push(this.fb.control(e.target.value));
    } else {
      const index = rolesArray.controls.findIndex((x) => x.value === e.target.value);
      rolesArray.removeAt(index);
    }
    if (this.userForm.get('roles_ids')?.value.length == 0) {
      this.selectCheckbox = true;
    } else {
      this.selectCheckbox = false;
    }
  }

  activarFormulario() {
    this.userForm.enable();
    this.estaEditando = true;
  }

  desactivarFormulario() {
    this.userForm.disable();
    this.estaEditando = false;
  }

  cargarUsuario() {
    if (this.userForm.valid) {
      Swal.fire({
        title: '¿Cargar nuevo usuario?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed) {
          const data = this.userForm.value;
          data.contrasenia = String(this.userForm.value.dni);
          data.roles_ids = data.roles_ids.map(Number);
          this._usuarioService.cargarUsuario(data).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                this.userForm.reset();
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

  editarUsuario() {
    if (this.usuario) {
      Swal.fire({
        title: '¿Modificar tu usuario?',
        showDenyButton: true,
        confirmButtonColor: '#3f77b4',
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result: any) => {
        if (result.isConfirmed && this.usuario) {
          const stringFechaActual = String(new Date(String(this.usuarioActual?.fe_nacimiento) + 'T12:00:00'));
          const stringFechaMod = String(this.userForm.value.fe_nacimiento);
          const valorFecha = this.userForm.value.fe_nacimiento.toISOString();
          const data = {
            ...(this.usuarioActual?.dni !== this.userForm.value.dni && { dni: this.userForm.value.dni }),
            ...(this.usuarioActual?.nombre !== this.userForm.value.nombre && { nombre: this.userForm.value.nombre }),
            ...(this.usuarioActual?.apellido !== this.userForm.value.apellido && { apellido: this.userForm.value.apellido }),
            ...(this.usuarioActual?.email !== this.userForm.value.email && { email: this.userForm.value.email }),
            ...(stringFechaActual !== stringFechaMod && { fe_nacimiento: valorFecha }),
          };
          this._usuarioService.modificarUsuario(this.usuario.id, data).subscribe({
            next: (response: any) => {
              if (response.success) {
                const identidadN = {
                  ...response.data,
                  roles_ids: this.usuario?.roles_ids,
                };
                this._sessionService.setIdentidad(identidadN);
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
      MostrarNotificacion.mensajeError(this.snackBar, 'No se esta editando ningun usuario.');
    }
  }
}
