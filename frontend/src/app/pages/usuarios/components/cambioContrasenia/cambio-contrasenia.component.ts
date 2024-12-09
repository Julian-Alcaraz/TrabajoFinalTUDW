import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { ContraseniaIgualDni, ContraseniasIguales, ValidarCadenaSinEspacios } from '@utils/validadores';
import { UsuarioService } from '@services/usuario.service';
import { Usuario } from '@models/usuario.model';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '@services/session.service';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatRadioModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './cambio-contrasenia.component.html',
})
export class CambiarContraseniaComponent implements OnInit {
  public identidad: Usuario | null = null;
  public mostrarContrasenia = false;
  public mostrarContraseniaConfirmar = false;
  public cambioForm: FormGroup;
  public cambioObligatorio = false;
  constructor(
    private _sessionService: SessionService,
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibir datos
  ) {
    if (data && data.cambioObligatorio) {
      this.cambioObligatorio = true;
    }
    this.cambioForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30), ValidarCadenaSinEspacios]],
        confirmPassword: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30), ValidarCadenaSinEspacios]],
      },
      { validators: ContraseniasIguales },
    );
  }
  ngOnInit(): void {
    this.identidad = this._sessionService.getIdentidad();
    if (this.identidad) {
      this.cambioForm.get('password')?.addValidators(ContraseniaIgualDni(this.identidad!.dni));
    }
  }

  cerraModal() {
    this._dialog.closeAll();
  }
  cambiarContrasenia() {
    Swal.fire({
      title: '¿Quieres guardar los cambios?',
      text: this.cambioObligatorio ? 'Se cerrara su sesion automaticamente.' : '',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.identidad) {
          this._usuarioService.modificarContrasenia(this.identidad.id, this.cambioForm.value).subscribe({
            next: (response: any) => {
              if (response.success) {
                MostrarNotificacion.mensajeExito(this.snackBar, response.message);
                if (this.cambioObligatorio) {
                  this._sessionService.cerrarSesion();
                }
                this._dialog.closeAll();
              } else {
                MostrarNotificacion.mensajeError(this.snackBar, response.message);
              }
            },
            error: (err: any) => {
              MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            },
          });
        }
      }
    });
  }

  verContrasenia(nombreInput: string) {
    if (nombreInput === 'password') this.mostrarContrasenia = !this.mostrarContrasenia;
    if (nombreInput === 'confirmPassword') this.mostrarContraseniaConfirmar = !this.mostrarContraseniaConfirmar;
  }
}
