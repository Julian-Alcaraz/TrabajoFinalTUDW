import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { AlimentacionType, CantidadComidasType, ExamenVisualType, HidratacionType, HsJuegoAireLibreType, HsPantallaType, HsSuenioType, InfusionesType, LenguajeType, OrtopediaYTraumatologiaType, VacunasType } from '../entities/clinica.entity';
// TA se calcula
// Estado nutricional se calcula y se guarda.
// imc no lo agrego al dto por que lo calculamos en el back
export class CreateClinicaDto {
  @ApiProperty({ description: 'Indica las vacunas que tiene el niño' })
  @IsNotEmpty({ message: 'Las vacunas no pueden estar vacias' })
  @IsEnum(['Completo', 'Incompleto', 'Desconocido'], { message: 'El tipo no es una opcion valida. Completo, Incompleto, Desconocido' })
  readonly vacunas: VacunasType;

  @ApiProperty({ description: 'Resultados del examen visual del niño que asiste' })
  @IsNotEmpty({ message: 'El examen visual no puede estar vacio' })
  @IsEnum(['Normal', 'Anormal'], { message: 'El tipo no es una opcion valida. Normal, Anormal' })
  readonly examen_visual: ExamenVisualType;

  @ApiProperty({ description: 'Ortopedia y traumatologia del niño que asiste' })
  @IsNotEmpty({ message: 'Ortopedia y traumatologia no puede estar vacio' })
  @IsEnum(['Normal', 'Escoliosis', 'Pie Plano', 'Otras'], { message: 'El tipo no es una opcion valida. Normal, Escoliosis, Pie Plano, Otras' })
  readonly ortopedia_traumatologia: OrtopediaYTraumatologiaType;

  @ApiProperty({ description: 'Lenguaje del niño que asiste' })
  @IsNotEmpty({ message: 'Lenguaje no puede estar vacio' })
  @IsEnum(['Adecuado', 'Inadecuado'], { message: 'El tipo no es una opcion valida. Adecuado, Inadecuado' })
  readonly lenguaje: LenguajeType;

  @ApiProperty({ description: 'Alimentacion del niño que asiste' })
  @IsNotEmpty({ message: 'Alimentacion no puede estar vacio' })
  @IsEnum(['Mixta y variada', 'Rica en HdC', 'Pobre en fibras', 'Fiambres', 'Frituras'], { message: 'El tipo no es una opcion valida. Mixta y variada, Rica en HdC, Pobre en fibras, Fiambres, Frituras' })
  readonly alimentacion: AlimentacionType;

  @ApiProperty({ description: 'Ingesta de infusiones del niño' })
  @IsNotEmpty({ message: 'Ingesta de infusiones no puede estar vacio' })
  @IsEnum(['Té', 'Mate Cocido', 'Otras'], { message: 'El tipo no es una opcion valida. Té, Mate Cocido, Otras' })
  readonly infusiones: InfusionesType;

  @ApiProperty({ description: 'Cantidad de comidas del niño que asiste' })
  @IsNotEmpty({ message: 'Cantidad de comidas  no puede estar vacio' })
  @IsEnum(['Menor a 4', '4', 'Mayor a 4', 'Picoteo'], { message: 'El tipo no es una opcion valida. Menor a 4, 4, Mayor a 4, Picoteo' })
  readonly cantidad_comidas: CantidadComidasType;

  @ApiProperty({ description: 'Horas de pantallas diarias' })
  @IsNotEmpty({ message: 'La hora no puede estar vacía' })
  @IsEnum(['Menor a 2hs', 'Entre 2hs y 4hs', 'Más de 6hs'], { message: 'El tipo no es una opcion valida. Menor a 2hs, Entre 2hs y 4hs, Más de 6hs' })
  readonly horas_pantalla: HsPantallaType;

  @ApiProperty({ description: 'Horas de juego al aire libre' })
  @IsNotEmpty({ message: 'Las horas de juego al aire libre no puede estar vacía' })
  @IsEnum(['Menos de 1h', '1h', 'Más de 1h'], { message: 'El tipo no es una opcion valida. Menos de 1h, 1h, Más de 1h' })
  readonly horas_juego_aire_libre: HsJuegoAireLibreType;

  @ApiProperty({ description: 'Horas de sueño' })
  @IsNotEmpty({ message: 'Las horas de sueño no puede estar vacía' })
  @IsEnum(['Menos de 10hs', 'Entre 10hs y 12hs', 'Más de 13hs'], { message: 'El tipo no es una opcion valida. Menos de 10hs, Entre 10hs y 12hs, Más de 13hs' })
  readonly horas_suenio: HsSuenioType;

  @ApiProperty({ description: 'Hidratacion del niño que asiste' })
  @IsNotEmpty({ message: 'Hidratacion no puede estar vacio' })
  @IsEnum(['Agua', 'Bebidas Edulcoradas'], { message: 'El tipo no es una opcion valida. Agua, Bebidas Edulcoradas' })
  readonly hidratacion: HidratacionType;

  @ApiProperty({ description: 'Tiene diabetes' })
  @IsNotEmpty({ message: 'La diabetes no puede estar vacia' })
  @IsBoolean({ message: 'La diabetes debe ser un boleano' })
  readonly diabetes: boolean;

  @ApiProperty({ description: 'Tiene hipertensión arterial' })
  @IsNotEmpty({ message: 'La hipertensión no puede estar vacia' })
  @IsBoolean({ message: 'La hipertensión debe ser un boleano' })
  readonly hta: boolean;

  @ApiProperty({ description: 'Tiene obesidad' })
  @IsNotEmpty({ message: 'La obesidad no puede estar vacia' })
  @IsBoolean({ message: 'La obesidad debe ser un boleano' })
  readonly obesidad: boolean;

  @ApiProperty({ description: 'Consume alchol' })
  @IsNotEmpty({ message: 'Consumo de alchol no puede estar vacio' })
  @IsBoolean({ message: 'Consumo de alchol debe ser un boleano' })
  readonly consumo_alcohol: boolean;

  @ApiProperty({ description: 'Consume drogas' })
  @IsNotEmpty({ message: 'Consumo de drogas no puede estar vacio' })
  @IsBoolean({ message: 'Consumo de drogas debe ser un boleano' })
  readonly consumo_drogas: boolean;

  @ApiProperty({ description: 'Consume tabaco' })
  @IsNotEmpty({ message: 'Consumo de tabaco no puede estar vacio' })
  @IsBoolean({ message: 'Consumo de tabaco debe ser un boleano' })
  readonly consumo_tabaco: boolean;

  @ApiProperty({ description: 'Tiene antecedentes perinatal' })
  @IsNotEmpty({ message: 'Antecedente perinatal de drogas no puede estar vacio' })
  @IsBoolean({ message: 'Antecedente perinatal de drogas debe ser un boleano' })
  readonly antecedentes_perinatal: boolean;

  @ApiProperty({ description: 'Tiene enfermedades previas' })
  @IsNotEmpty({ message: 'Enfermedades previas no puede estar vaci' })
  @IsBoolean({ message: 'Enfermedades previas debe ser un boleano' })
  readonly enfermedades_previas: boolean;

  @ApiProperty({ description: 'Peso del niño que asiste' })
  @IsNotEmpty({ message: 'El peso no puede estar vacio' })
  @IsNumber({}, { message: 'El peso  debe ser un número' })
  @IsPositive({ message: 'El peso debe ser un numero positivo' })
  readonly peso: number;

  @ApiProperty({ description: 'La talla del niño que asiste' })
  @IsNotEmpty({ message: 'La talla no puede estar vacia' })
  @IsNumber({}, { message: 'La talla debe ser un número' })
  @IsPositive({ message: 'La talla debe ser un numero positivo' })
  readonly talla: number;

  @ApiProperty({ description: 'El percentillo de talla del niño que asiste' })
  @IsNotEmpty({ message: 'El percentillo de talla no puede estar vacio' })
  @IsNumber({}, { message: 'El percentillo de talla debe ser un número' })
  @IsPositive({ message: 'El percentillo de talla debe ser un numero positivo' })
  readonly pct: number;

  @ApiProperty({ description: 'La circunferencia de cintura del niño que asiste' })
  @IsNotEmpty({ message: 'La circunferencia de cintura no puede estar vacia' })
  @IsNumber({}, { message: 'La circunferencia de cintura debe ser un número' })
  @IsPositive({ message: 'La circunferencia de cintura debe ser un numero positivo' })
  readonly cc: number;

  @ApiProperty({ description: 'El percentillo de imc del niño que asiste' })
  @IsNotEmpty({ message: 'El percentillo de imc no puede estar vacia' })
  @IsNumber({}, { message: 'El percentillo de imc debe ser un número' })
  @IsPositive({ message: 'El percentillo de imc debe ser un numero positivo' })
  readonly pcimc: number;

  @ApiProperty({ description: 'La tension arterial sistolica del niño que asiste' })
  @IsNotEmpty({ message: 'La tension arterial sistolica no puede estar vacia' })
  @IsNumber({}, { message: 'La tension arterial sistolica debe ser un número' })
  @IsPositive({ message: 'La tension arterial sistolica debe ser un numero positivo' })
  readonly tas: number;

  @ApiProperty({ description: 'La tension arterial diastolica del niño que asiste' })
  @IsNotEmpty({ message: 'La tension arterial diastolica no puede estar vacia' })
  @IsNumber({}, { message: 'La tension arterial diastolica debe ser un número' })
  @IsPositive({ message: 'La tension arterial diastolica debe ser un numero positivo' })
  readonly tad: number;

  @ApiProperty({ description: 'El percentillo de la tension arterial del niño que asiste' })
  @IsNotEmpty({ message: 'El percentillo de la tension arterial no puede estar vacio' })
  @IsNumber({}, { message: 'El percentillo de la tension arterial debe ser un número' })
  @IsPositive({ message: 'El percentillo de la tension arterial debe ser un numero positivo' })
  readonly pcta: number;

  @ApiProperty({ description: 'SEGTO del niño' })
  @IsNotEmpty({ message: 'SEGTO no puede estar vacio' })
  @IsBoolean({ message: 'SEGTO debe ser un boleano' })
  readonly segto: boolean;

  @ApiProperty({ description: 'Ingesta de leche del niño' })
  @IsNotEmpty({ message: 'Ingesta de leche no puede estar vacio' })
  @IsBoolean({ message: 'Ingesta de leche debe ser un boleano' })
  readonly leche: boolean;
}
