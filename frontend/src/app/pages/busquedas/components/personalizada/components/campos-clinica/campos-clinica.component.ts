import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as Constantes from '@app/common/const/const';
import { validarRango } from '@app/utils/validadores';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-campos-clinica',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, IftaLabelModule, SelectModule, MultiSelectModule, InputNumberModule, KeyFilterModule],
  templateUrl: './campos-clinica.component.html',
})
export class CamposClinicaComponent implements OnInit {
  @Input() form!: FormGroup;

  public especificas!: FormGroup;
  public con = Constantes;

  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public vacunasOptions: string[] = this.con.VacunasEnum;
  public examenVisualOptions: string[] = this.con.ExamenVisualEnum;
  public lenguajeOptions: string[] = this.con.LenguajeEnum;
  public ortopediaTraumatologiaOptions: string[] = this.con.OrtopediaYTraumatologiaEnum;
  public alimentacionOptions: string[] = this.con.AlimentacionEnum;
  public hidratacionOptions: string[] = this.con.HidratacionEnum;
  public horasPantallaOptions: string[] = this.con.HsPantallaEnum;
  public horasJuegoAireLibreOptions: string[] = this.con.HsJuegoAireLibreEnum;
  public horasSuenioOptions: string[] = this.con.HsSuenioEnum;
  public tensionArterialOptions: string[] = ['Normotenso', 'Riesgo', 'Hipertenso'];
  public estadoNutricionalOptions: string[] = ['A Riesgo Nutricional', 'B Bajo peso/Desnutrido', 'C Eutrófico', 'D Sobrepeso', 'E Obesidad'];
  public derivacionesOptionsClinica: any[] = [
    { nombre: 'Fonoaudiologia', valor: { fonoaudiologia: true } },
    { nombre: 'Odontologia', valor: { odontologia: true } },
    { nombre: 'Oftalmologia', valor: { oftalmologia: true } },
    { nombre: 'Prevención', valor: { prevencion: true } },
    { nombre: 'Trabajo Social', valor: { social: true } },
  ];

  ngOnInit(): void {
    this.especificas = new FormGroup({
      rangoTalla: new FormGroup(
        {
          tallaMin: new FormControl(),
          tallaMax: new FormControl(),
        },
        { validators: validarRango('tallaMin', 'tallaMax') },
      ),
      rangoCC: new FormGroup(
        {
          ccMin: new FormControl(),
          ccMax: new FormControl(),
        },
        { validators: validarRango('ccMin', 'ccMax') },
      ),
      rangoPeso: new FormGroup(
        {
          pesoMin: new FormControl(),
          pesoMax: new FormControl(),
        },
        { validators: validarRango('pesoMin', 'pesoMax') },
      ),
      rangoPct: new FormGroup(
        {
          pctMin: new FormControl(),
          pctMax: new FormControl(),
        },
        { validators: validarRango('pctMin', 'pctMax') },
      ),
      rangoTas: new FormGroup(
        {
          tasMin: new FormControl(),
          tasMax: new FormControl(),
        },
        { validators: validarRango('tasMin', 'tasMax') },
      ),
      rangoTad: new FormGroup(
        {
          tadMin: new FormControl(),
          tadMax: new FormControl(),
        },
        { validators: validarRango('tadMin', 'tadMax') },
      ),
      diabetes: new FormControl(),
      hta: new FormControl(),
      obesidad: new FormControl(),
      consumo_alcohol: new FormControl(),
      consumo_drogas: new FormControl(),
      consumo_tabaco: new FormControl(),
      antecedentes_perinatal: new FormControl(),
      enfermedades_previas: new FormControl(),
      vacunas: new FormControl(),
      examen_visual: new FormControl(),
      lenguaje: new FormControl(),
      ortopedia_traumatologia: new FormControl(),
      alimentacion: new FormControl(),
      hidratacion: new FormControl(),
      segto: new FormControl(),
      es_clinica: new FormControl(),
      horas_pantalla: new FormControl(),
      horas_juego_aire_libre: new FormControl(),
      horas_suenio: new FormControl(),
      tension_arterial: new FormControl(),
      estado_nutricional: new FormControl(),
      derivaciones: new FormControl(),
    });
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
