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
import * as Constantes from '@app/common/const/const';
import { validarRango } from '@app/utils/validadores';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-campos-prevencion',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ButtonModule, ReactiveFormsModule, IftaLabelModule, MultiSelectModule, InputNumberModule, KeyFilterModule, DatePickerModule, SelectModule],
  templateUrl: './campos-prevencion.component.html',
})
export class CamposPrevencionComponent implements OnInit {
  @Input() form!: FormGroup;

  public especificas!: FormGroup;
  public con = Constantes;
  public motivoCon: string[] = this.con.MotivoConsumoEnum;
  public frecuenciaCon: string[] = this.con.FrecuenciaPrevencionEnum;
  public consumoProblematicoCon: string[] = this.con.ConsumoProblematicoEnum;
  public otraProblematicaCon: string[] = this.con.OtraProblematicaEnum;
  public derivacionesOptions: any[] = [
    { nombre: 'Si', valor: { externa: true } },
    { nombre: 'No', valor: { externa: false } },
  ];
  ngOnInit(): void {
    this.especificas = new FormGroup({
      // prevencion
      edad_inicio_consumo: new FormControl(),
      rangoEdadInicioconsumo: new FormGroup(
        {
          edadInicioMin: new FormControl(),
          edadInicioMax: new FormControl(),
        },
        { validators: validarRango('edadInicioMin', 'edadInicioMax') },
      ),
      motivo_consumo: new FormControl(),
      frecuencia: new FormControl(),
      consumo_problematico: new FormControl(),
      otra_problematica: new FormControl(),
      derivaciones: new FormControl(),
    });
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
