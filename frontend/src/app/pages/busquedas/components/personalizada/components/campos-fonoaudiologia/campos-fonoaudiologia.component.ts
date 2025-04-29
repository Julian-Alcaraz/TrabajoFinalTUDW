import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';

import * as Constantes from '@app/common/const/const';

@Component({
  selector: 'app-campos-fonoaudiologia',
  standalone: true,
  imports: [SelectButtonModule, ReactiveFormsModule, IftaLabelModule, SelectModule, MultiSelectModule, InputNumberModule, KeyFilterModule],
  templateUrl: './campos-fonoaudiologia.component.html',
})
export class CamposFonoaudiologiaComponent implements OnInit {
  @Input() form!: FormGroup;

  public con = Constantes;
  public especificas!: FormGroup;

  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public diagnosticoPresuntivoOptions: string[] = this.con.DiagnosticoPresuntivoEnum;
  public casuasOptions: string[] = this.con.CausasEnum;
  public derivacionesOptions: any[] = [
    { nombre: 'Si', valor: { externa: true } },
    { nombre: 'No', valor: { externa: false } },
  ];

  ngOnInit(): void {
    this.especificas = new FormGroup({
      diagnostico_presuntivo: new FormControl(),
      causas: new FormControl(),
      asistencia: new FormControl(),
      derivaciones: new FormControl(),
    });
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
