import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';

import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-campos-odontologia',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, IftaLabelModule, SelectModule, MultiSelectModule, InputNumberModule, KeyFilterModule],
  templateUrl: './campos-odontologia.component.html',
  styleUrl: './campos-odontologia.component.css',
})
export class CamposOdontologiaComponent implements OnInit {
  @Input() form!: FormGroup;

  public especificas!: FormGroup;

  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public clasificacionDentalOptions: string[] = ['Sin clasificación', 'Boca sana', 'Bajo índice de caries', 'Moderado índice de caries', 'Alto índice de caries'];
  public derivacionesOptions: any[] = [
    { nombre: 'Si', valor: { externa: true } },
    { nombre: 'No', valor: { externa: false } },
  ];

  ngOnInit(): void {
    this.especificas = new FormGroup({
      rangoDientesPermanentes: new FormGroup(
        {
          dientesPermanentesMin: new FormControl(),
          dientesPermanentesMax: new FormControl(),
        },
        { validators: this.validarRango('dientesPermanentesMin', 'dientesPermanentesMax') },
      ),
      rangoDientesTemporales: new FormGroup(
        {
          dientesTemporalesMin: new FormControl(),
          dientesTemporalesMax: new FormControl(),
        },
        { validators: this.validarRango('dientesTemporalesMin', 'dientesTemporalesMax') },
      ),
      rangoSellador: new FormGroup(
        {
          selladorMin: new FormControl(),
          selladorMax: new FormControl(),
        },
        { validators: this.validarRango('selladorMin', 'selladorMax') },
      ),
      topificacion: new FormControl(),
      cepillado: new FormControl(),
      cepillo: new FormControl(),
      clasificacion: new FormControl(),
      ulterior: new FormControl(),
      primera_vez: new FormControl(),
    });
    const generalesGroup = this.form.get('generales') as FormGroup;
    if (generalesGroup) {
      generalesGroup.addControl('derivaciones', new FormControl());
    } else {
      console.error("El grupo 'generales' no existe o no es un FormGroup en el formulario padre.");
    }
    this.form.addControl('derivaciones', new FormControl());
    this.form.addControl('especificas', this.especificas);
  }

  validarRango: (campoMin: string, campoMax: string) => ValidatorFn = (campoMin, campoMax) => {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const valorMin = formGroup.get(campoMin)?.value;
      const valorMax = formGroup.get(campoMax)?.value;
      if (valorMin === '' || valorMax === '' || valorMin === null || valorMax === null) {
        return null;
      }
      if (valorMin !== '' && valorMax !== '' && valorMin <= valorMax) {
        return null;
      }
      return { rangoInvalido: true };
    };
  };

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
