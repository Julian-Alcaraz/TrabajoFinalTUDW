import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { KeyFilterModule } from 'primeng/keyfilter';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-campos-especificos',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, IftaLabelModule, SelectModule, MultiSelectModule, InputNumberModule, KeyFilterModule, DatePickerModule],
  templateUrl: './campos-especificos.component.html',
  styleUrl: './campos-especificos.component.css',
})
export class CamposEspecificosComponent implements OnInit {
  @Input() consultasSeleccionadas: string[] = [];
  @Input() form!: FormGroup;

  public especificas!: FormGroup;
  public siNoOptions: any[] = [
    { nombre: 'Si', valor: true },
    { nombre: 'No', valor: false },
  ];
  public vacunasOptions: string[] = ['Completo', 'Incompleto', 'Se desconoce'];
  public examenVisualOptions: string[] = ['Normal', 'Anormal'];
  public lenguajeOptions: string[] = ['Adecuado', 'Inadecuado'];
  public ortopediaTraumatologiaOptions: string[] = ['Normal', 'Escoliosis', 'Pie plano'];
  public alimentacionOptions: string[] = ['Mixta y variada', 'Rica en HdC', 'Pobre en fibras', 'Fiambres', 'Frituras'];
  public hidratacionOptions: string[] = ['Agua', 'Bebidas edulcoradas'];
  public horasPantallaOptions: string[] = ['Menor a 2hs', 'Entre 2hs y 4hs', 'Mas de 6hs'];
  public horasJuegoAireLibreOptions: string[] = ['Menos de 1h', '1h', 'Mas de 1h'];
  public horasSuenioOptions: string[] = ['Menos de 10hs', 'Entre 10hs y 12hs', 'Mas de 13hs'];
  public tensionArterialOptions: string[] = ['Normotenso', 'Riesgo', 'Hipertenso'];
  public estadoNutricionalOptions: string[] = ['A Riesgo Nutricional', 'B Bajo peso/Desnutrido', 'C Eutrófico', 'D Sobrepeso', 'E Obesidad'];
  public derivacionesOptionsClinica: any[] = [
    { nombre: 'Fonoaudiologia', valor: { fonoaudiologia: true } },
    { nombre: 'Odontologia', valor: { odontologia: true } },
    { nombre: 'Oftalmologia', valor: { oftalmologia: true } },
  ];
  public derivacionesOptions: any[] = [{ nombre: 'Si', valor: { externa: true } }];
  public clasificacionDentalOptions: string[] = ['Boca sana', 'Bajo índice de caries', 'Moderado índice de caries', 'Alto índice de caries'];
  public diagnosticoPresuntivoOptions: string[] = ['Tel', 'Tea', 'Retraso en el lenguaje dislalias funcionales', 'Respirador bucal', 'Aniquilogosia', 'Ortodoncia: Protusion lingual, paladar hendido', 'Sindromes', 'Otras patologias que dificulten el lenguaje y la comunicacion'];
  public casuasOptions: string[] = ['Prenatal', 'Postnatal', 'Acv', 'Respiratorias', 'Audicion', 'Patologias clinicas', 'Sindromes', 'Inflamacion de amigdalas o adenoides', 'Prematurez', 'Otras'];
  public cantidadComidasOptions: string[] = ['4', 'Mayor a 4', 'Menor a 4', 'Picoteo'];
  /*
  FALTAN EN CLINICA:
    tas: [70, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
    tad: [120, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
*/

  ngOnInit(): void {
    this.especificas = new FormGroup({
      // Clinica
      rangoTalla: new FormGroup(
        {
          tallaMin: new FormControl(),
          tallaMax: new FormControl(),
        },
        { validators: this.validarRango('tallaMin', 'tallaMax') },
      ),
      rangoCC: new FormGroup(
        {
          ccMin: new FormControl(),
          ccMax: new FormControl(),
        },
        { validators: this.validarRango('ccMin', 'ccMax') },
      ),
      rangoPeso: new FormGroup(
        {
          pesoMin: new FormControl(),
          pesoMax: new FormControl(),
        },
        { validators: this.validarRango('pesoMin', 'pesoMax') },
      ),
      rangoPct: new FormGroup(
        {
          pctMin: new FormControl(),
          pctMax: new FormControl(),
        },
        { validators: this.validarRango('pctMin', 'pctMax') },
      ),
      rangoTas: new FormGroup(
        {
          tasMin: new FormControl(),
          tasMax: new FormControl(),
        },
        { validators: this.validarRango('tasMin', 'tasMax') },
      ),
      rangoTad: new FormGroup(
        {
          tadMin: new FormControl(),
          tadMax: new FormControl(),
        },
        { validators: this.validarRango('tadMin', 'tadMax') },
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
      horas_pantalla: new FormControl(),
      horas_juego_aire_libre: new FormControl(),
      horas_suenio: new FormControl(),
      tension_arterial: new FormControl(),
      estado_nutricional: new FormControl(),
      // Oftalmologia
      rangoFechasProxControl: new FormControl(),
      receta: new FormControl(),
      control: new FormControl(),
      primera_vez: new FormControl(),
      anteojos: new FormControl(),
      // Odontologia
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
      // Fonoaudiologia
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
