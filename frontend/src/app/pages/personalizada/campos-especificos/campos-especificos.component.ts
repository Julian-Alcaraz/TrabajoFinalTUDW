import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-campos-especificos',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, IftaLabelModule, SelectModule, MultiSelectModule],
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
    { nombre: 'Fonoaudiologia', valor: { Fonoaudiologia: true } },
    { nombre: 'Odontologia', valor: { Odontologia: true } },
    { nombre: 'Oftalmologia', valor: { Oftalmologia: true } },
  ];
  public derivacionesOptions: any[] = [{ nombre: 'Si', valor: { Externa: true } }];
  public clasificacionDentalOptions: string[] = ['Boca sana', 'Bajo índice de caries', 'Moderado índice de caries', 'Alto índice de caries'];
  public diagnosticoPresuntivoOptions: string[] = ['Tel', 'Tea', 'Retraso en el lenguaje dislalias funcionales', 'Respirador bucal', 'Aniquilogosia', 'Ortodoncia: Protusion lingual, paladar hendido', 'Sindromes', 'Otras patologias que dificulten el lenguaje y la comunicacion'];
  public casuasOptions: string[] = ['Prenatal', 'Postnatal', 'Acv', 'Respiratorias', 'Audicion', 'Patologias clinicas', 'Sindromes', 'Inflamacion de amigdalas o adenoides', 'Prematurez', 'Otras'];
  public cantidadComidasOptions: string[] = ['4','Mayor a 4','Menor a 4','Picoteo',]
  /*
  FALTAN EN CLINICA:
      talla: [170, [Validators.required, ValidarNumerosFloat]],
      cc: [40, [Validators.required, ValidarNumerosFloat]],
      tas: [70, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
      tad: [120, [Validators.required, ValidarNumerosFloat]], // Deberia ser solo entero ?
*/

  ngOnInit(): void {
    this.especificas = new FormGroup({
      // Clinica
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
      cantidad_comidas: new FormControl(),
      // Oftalmologia
      receta: new FormControl(),
      control: new FormControl(),
      primera_vez: new FormControl(),
      anteojos: new FormControl(),
      // Odontologia
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
    this.form.addControl('derivaciones', new FormControl());
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
