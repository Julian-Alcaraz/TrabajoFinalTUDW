import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarCadenaSinEspacios, ValidarEmail } from '../../../../utils/validadores';
import { SessionService } from '../../../../services/session.service';
import { Router } from '@angular/router';
import * as MostrarNotificacion from '../../../../utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class FormularioComponent {
  // loginForm = new FormGroup({
  //   email: new FormControl(''),
  //   password: new FormControl(''),
  // });\
  public loginForm: FormGroup;
  public mostrarContrasenia = false;

  constructor(
    private fb: FormBuilder,
    private _sessionService: SessionService,
    private _router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, ValidarEmail, ValidarCadenaSinEspacios]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
  }
  iniciarSession() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this._sessionService.iniciarSession(email, password).subscribe(
      (response) => {
        if (response.success) {
          this._sessionService.setIdentidad(response.data);
          // this._router.navigate(['/layout']);
          this._router.navigate(['/layout'], { queryParams: { from: 'login' } });

        } else {
          MostrarNotificacion.mensajeError(this.snackBar, response.message);
        }
      },
      (err: any) => {
        MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
      },
    );
  }
  verContrasenia() {
    this.mostrarContrasenia = !this.mostrarContrasenia;
  }
}
