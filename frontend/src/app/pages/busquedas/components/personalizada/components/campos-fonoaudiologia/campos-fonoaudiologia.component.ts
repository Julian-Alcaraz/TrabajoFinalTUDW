import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-campos-fonoaudiologia',
  standalone: true,
  imports: [SelectButtonModule, ReactiveFormsModule, IftaLabelModule, SelectModule, MultiSelectModule, InputNumberModule, KeyFilterModule],
  templateUrl: './campos-fonoaudiologia.component.html',
  styleUrl: './campos-fonoaudiologia.component.css'
})
export class CamposFonoaudiologiaComponent implements OnInit {
  @Input() form!: FormGroup;

  public especificas!: FormGroup;

  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public diagnosticoPresuntivoOptions: string[] = ['Tel', 'Tea', 'Retraso en el lenguaje dislalias funcionales', 'Respirador bucal', 'Aniquilogosia', 'Ortodoncia: Protusion lingual, paladar hendido', 'Sindromes', 'Otras patologias que dificulten el lenguaje y la comunicacion'];
  public casuasOptions: string[] = ['Prenatal', 'Postnatal', 'Acv', 'Respiratorias', 'Audicion', 'Patologias clinicas', 'Sindromes', 'Inflamacion de amigdalas o adenoides', 'Prematurez', 'Otras'];
  public derivacionesOptions: any[] = [{ nombre: 'Si', valor: { externa: true } }];

  ngOnInit(): void {
    this.especificas = new FormGroup({
      diagnostico_presuntivo: new FormControl(),
      causas: new FormControl(),
      asistencia: new FormControl(),
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

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
