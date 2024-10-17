import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, /*Validators*/ } from '@angular/forms';
//import { ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarDni, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';

@Component({
  selector: 'app-campos-generales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './campos-generales.component.html',
  styleUrl: './campos-generales.component.css',
})
export class CamposGeneralesComponent {
  @Input({ required: true }) form!: FormGroup;
  @Input() errorDni: string | null = null;

  constructor(private fb: FormBuilder) {
    /*
    this.form = this.fb.group({
      camposGenerales: this.fb.group({
        obra_social: ['Osde', [ValidarCampoOpcional(Validators.minLength(3), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
        edad: ['', [Validators.required, ValidarSoloNumeros, ValidarCadenaSinEspacios]],
        observaciones: ['', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
        dni: ['', [Validators.required, ValidarSoloNumeros, ValidarDni]] //Math.floor(10000000 + Math.random() * 90000000),/,
      }),
    });
    */
  }
}
