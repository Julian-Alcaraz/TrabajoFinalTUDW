import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { validarRango } from '@app/utils/validadores';

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
        { validators: validarRango('dientesPermanentesMin', 'dientesPermanentesMax') },
      ),
      rangoDientesTemporales: new FormGroup(
        {
          dientesTemporalesMin: new FormControl(),
          dientesTemporalesMax: new FormControl(),
        },
        { validators: validarRango('dientesTemporalesMin', 'dientesTemporalesMax') },
      ),
      rangoSellador: new FormGroup(
        {
          selladorMin: new FormControl(),
          selladorMax: new FormControl(),
        },
        { validators: validarRango('selladorMin', 'selladorMax') },
      ),
      topificacion: new FormControl(),
      cant_cepillado: new FormControl(),
      cepillo: new FormControl(),
      clasificacion: new FormControl(),
      ulterior: new FormControl(),
      primera_vez: new FormControl(),
      derivaciones: new FormControl(),
    });
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
