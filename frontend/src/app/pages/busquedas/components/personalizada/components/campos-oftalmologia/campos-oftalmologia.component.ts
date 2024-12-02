import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  imports: [SelectButtonModule, ReactiveFormsModule, IftaLabelModule, MultiSelectModule, InputNumberModule, KeyFilterModule, DatePickerModule, SelectModule],
  templateUrl: './campos-oftalmologia.component.html',
  styleUrl: './campos-oftalmologia.component.css',
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
    });
    const generalesGroup = this.form.get('generales') as FormGroup;
    if (generalesGroup) {
      generalesGroup.addControl('derivaciones', new FormControl());
    } else {
      console.error("El grupo 'generales' no existe o no es un FormGroup en el formulario padre.");
    }
    // VER DE SACAR ESTAS DERIVACIONES:!!!!!!!
    this.form.addControl('derivaciones', new FormControl());
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
