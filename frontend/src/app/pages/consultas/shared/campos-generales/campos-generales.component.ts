import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { /*ExisteDni,*/ ValidarCadenaSinEspacios, ValidarCampoOpcional, ValidarDni, ValidarSoloLetras, ValidarSoloNumeros } from '../../../../utils/validadores';
/*
<!-- !!!!!!!!!!!!! 1. type:  enum: ['Clinica', 'Fonoaudiologia', 'Oftalmologia', 'Odontologia'] -->
<!-- 2. obra_social: string length: 100, nullable: true -->
<!-- 3. edad: number; type: 'int' -->
<!-- 4. observaciones: string; type: 'text', nullable: true-->
<!-- !!!!!!!!!!!!! 5. Relacion con usuario creo? -->
<!-- !!!!!!!!!!!!! 6. Relacion con chico creo? -->
<!-- !!!!!!!!!!!!! 7. Relacion con institucion creo? -->
<!-- !!!!!!!!!!!!! 8. Relacion con curso creo?-->
*/
@Component({
  selector: 'app-campos-generales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './campos-generales.component.html',
  styleUrl: './campos-generales.component.css',
})
export class CamposGeneralesComponent {
  public camposGeneralesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.camposGeneralesForm = this.fb.group({
      obra_social: ['obra_social', [ValidarCampoOpcional(Validators.minLength(3), Validators.maxLength(100), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
      edad: ['', [Validators.required, ValidarSoloNumeros, ValidarCadenaSinEspacios]],
      observaciones: ['observaciones', [ValidarCampoOpcional(Validators.minLength(1), Validators.maxLength(1000), ValidarCadenaSinEspacios, ValidarSoloLetras)]],
      dni: [/*Math.floor(10000000 + Math.random() * 90000000),*/ [Validators.required, ValidarDni, ValidarSoloNumeros]],
    });
  }

  onChangeDni() {
    console.log('aca hay que verificar que exista...');
  }
}
