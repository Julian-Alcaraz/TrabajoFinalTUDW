import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormUsuarioComponent } from '../components/form-usuario/form-usuario.component';
import { SessionService } from '../../../services/session.service';
import { Usuario } from '../../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContraseniasIguales, ValidarCadenaSinEspacios } from '../../../utils/validadores';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';
import * as MostrarNotificacion from '../../../utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mi-usuario',
  standalone: true,
  imports: [FormUsuarioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './mi-usuario.component.html',
  styleUrl: './mi-usuario.component.css',
})
export class MiUsuarioComponent implements OnInit {
  public identidad: Usuario | null = null;
  public mostrarContrasenia = false;
  public cambioForm: FormGroup;

  @ViewChild('cambiarContra') cambiarContra!: TemplateRef<any>;

  constructor(
    private _sessionService: SessionService,
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
  ) {
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
  }
  abrirModal() {
    const dialogRef = this._dialog.open(this.cambiarContra, { minWidth: '40%' });

    dialogRef.afterClosed().subscribe(() => {
      this.cambioForm.reset();
    });
  }
  cerraModal() {
    this._dialog.closeAll();
  }
  cambiarContrasenia() {
    Swal.fire({
      title: 'Quieres guardar los cambios?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.identidad) {
          this._usuarioService.modificarUsuario(this.identidad.id, this.cambioForm.value).subscribe({
            next: (response: any) => {
              if(response.success){
                MostrarNotificacion.mensajeExito(this.snackBar,response.message)
              }else{
                MostrarNotificacion.mensajeError(this.snackBar,response.message)
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

  verContrasenia() {
    this.mostrarContrasenia = !this.mostrarContrasenia;
  }
}
