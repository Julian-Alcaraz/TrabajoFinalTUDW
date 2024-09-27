import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { RolesService } from '../../../../services/roles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContraseniasIguales, ValidarCadenaSinEspacios } from '../../../../utils/validadores';
import { Rol } from '../../../../models/rol.model';
import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],

  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent  implements OnInit{
  public userForm: FormGroup;
  public mostrarContrasenia = false;
  public hoy = new Date();
  public roles: Rol[] = [];
  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _rolesService: RolesService,
    private snackBar: MatSnackBar,
  ) {
    this.userForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), ValidarCadenaSinEspacios]],
        apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), ValidarCadenaSinEspacios]],
        dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        email: ['', [Validators.required, Validators.email, ValidarCadenaSinEspacios]],
        // especialidad: ['', [Validators.required, ValidarCadenaSinEspacios]],
        fe_nacimiento: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30), ValidarCadenaSinEspacios]],
        confirmPassword: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30), ValidarCadenaSinEspacios]],
        // habilitado: ['', [Validators.required, , ValidarCadenaSinEspacios]],
        roles_ids: this.fb.array([], Validators.required), // FormArray para role
      },
      { validators: ContraseniasIguales },

    );
  }
  ngOnInit(): void {
    this._rolesService.obtenerRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  verContrasenia() {
    this.mostrarContrasenia = !this.mostrarContrasenia;
  }

  cargarUsuario() {
    if (this.userForm.valid) {
      const data = this.userForm.value;
      data.contrasenia = this.userForm.value.password;
      data.fe_nacimiento = data.fe_nacimiento.toISOString();
      data.roles_ids = data.roles_ids.map(Number);
      delete data.password;
      delete data.confirmPassword;
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
  }
  onCheckboxChange(e: any) {
    const rolesArray: FormArray = this.userForm.get('roles_ids') as FormArray;
    if (e.target.checked) {
      // Agregar el valor al FormArray
      rolesArray.push(this.fb.control(e.target.value));
    } else {
      // Si no está seleccionado, buscar su índice y eliminarlo
      const index = rolesArray.controls.findIndex((x) => x.value === e.target.value);
      rolesArray.removeAt(index);
    }
  }
}
