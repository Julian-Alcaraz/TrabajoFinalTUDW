import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarCadenaSinEspacios } from '../../../../utils/validadores';
import { SessionService } from '../../../../services/session.service';
import { Router } from '@angular/router';
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
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, ValidarCadenaSinEspacios]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(100), ValidarCadenaSinEspacios]],
    });
  }
  iniciarSession() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this._sessionService.iniciarSession(email, password).subscribe((data) => {
      if (data.success) {
        // console.log(data);
        localStorage.setItem('isLogged', 'true');
        this._router.navigate(['/layout']);
      }
    });
  }
  verContrasenia() {
    this.mostrarContrasenia = !this.mostrarContrasenia;
  }
}
