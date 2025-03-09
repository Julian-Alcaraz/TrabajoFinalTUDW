import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-campos-oftalmologia',
  standalone: true,
  imports: [SelectButtonModule, ButtonModule, ReactiveFormsModule, IftaLabelModule, MultiSelectModule, InputNumberModule, KeyFilterModule, DatePickerModule, SelectModule],
  templateUrl: './campos-oftalmologia.component.html',
})
export class CamposOftalmologiaComponent implements OnInit {
  @Input() form!: FormGroup;

  public especificas!: FormGroup;

  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public derivacionesOptions: any[] = [
    { nombre: 'Si', valor: { externa: true } },
    { nombre: 'No', valor: { externa: false } },
  ];
  ngOnInit(): void {
    this.especificas = new FormGroup({
      // Oftalmologia
      rangoFechasProxControl: new FormControl(),
      receta: new FormControl(),
      control: new FormControl(),
      primera_vez: new FormControl(),
      anteojos: new FormControl(),
      derivaciones: new FormControl(),
    });
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
