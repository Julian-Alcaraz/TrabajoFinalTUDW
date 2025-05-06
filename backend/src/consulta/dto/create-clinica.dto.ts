import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { VacunasType, VacunasEnum, ExamenVisualType, ExamenVisualEnum, OrtopediaYTraumatologiaType, OrtopediaYTraumatologiaEnum, LenguajeType, LenguajeEnum, AlimentacionType, AlimentacionEnum, InfusionesType, InfusionesEnum, CantidadComidasType, CantidadComidasEnum, HsPantallaType, HsPantallaEnum, HsJuegoAireLibreType, HsJuegoAireLibreEnum, HsSuenioType, HsSuenioEnum, HidratacionType, HidratacionEnum } from '../../common/const/const';
// TA se calcula
// Estado nutricional se calcula y se guarda.
// imc no lo agrego al dto por que lo calculamos en el back
export class CreateClinicaDto {
  @ApiProperty({ description: 'Indica las vacunas que tiene el niño' })
  @IsNotEmpty({ message: 'Las vacunas no pueden estar vacias' })
  @IsEnum(VacunasEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(VacunasEnum).join(', ')}` })
  @IsOptional()
  readonly vacunas?: VacunasType;

  @ApiProperty({ description: 'Resultados del examen visual del niño que asiste' })
  @IsNotEmpty({ message: 'El examen visual no puede estar vacio' })
  @IsEnum(ExamenVisualEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(ExamenVisualEnum).join(', ')}` })
  @IsOptional()
  readonly examen_visual?: ExamenVisualType;

  @ApiProperty({ description: 'Ortopedia y traumatologia del niño que asiste' })
  @IsNotEmpty({ message: 'Ortopedia y traumatologia no puede estar vacio' })
  @IsEnum(OrtopediaYTraumatologiaEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(OrtopediaYTraumatologiaEnum).join(', ')}` })
  @IsOptional()
  readonly ortopedia_traumatologia?: OrtopediaYTraumatologiaType;

  @ApiProperty({ description: 'Lenguaje del niño que asiste' })
  @IsNotEmpty({ message: 'Lenguaje no puede estar vacio' })
  @IsEnum(LenguajeEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(LenguajeEnum).join(', ')}` })
  @IsOptional()
  readonly lenguaje?: LenguajeType;

  @ApiProperty({ description: 'Alimentacion del niño que asiste' })
  @IsNotEmpty({ message: 'Alimentacion no puede estar vacio' })
  @IsEnum(AlimentacionEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(AlimentacionEnum).join(', ')}` })
  @IsOptional()
  readonly alimentacion?: AlimentacionType;

  @ApiProperty({ description: 'Ingesta de infusiones del niño' })
  @IsNotEmpty({ message: 'Ingesta de infusiones no puede estar vacio' })
  @IsEnum(InfusionesEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(InfusionesEnum).join(', ')}` })
  @IsOptional()
  readonly infusiones?: InfusionesType;

  @ApiProperty({ description: 'Cantidad de comidas del niño que asiste' })
  @IsNotEmpty({ message: 'Cantidad de comidas  no puede estar vacio' })
  @IsEnum(CantidadComidasEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(CantidadComidasEnum).join(', ')}` })
  @IsOptional()
  readonly cantidad_comidas?: CantidadComidasType;

  @ApiProperty({ description: 'Horas de pantallas diarias' })
  @IsNotEmpty({ message: 'La hora no puede estar vacía' })
  @IsEnum(HsPantallaEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(HsPantallaEnum).join(', ')}` })
  @IsOptional()
  readonly horas_pantalla?: HsPantallaType;

  @ApiProperty({ description: 'Horas de juego al aire libre' })
  @IsNotEmpty({ message: 'Las horas de juego al aire libre no puede estar vacía' })
  @IsEnum(HsJuegoAireLibreEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(HsJuegoAireLibreEnum).join(', ')}` })
  @IsOptional()
  readonly horas_juego_aire_libre?: HsJuegoAireLibreType;

  @ApiProperty({ description: 'Horas de sueño' })
  @IsNotEmpty({ message: 'Las horas de sueño no puede estar vacía' })
  @IsEnum(HsSuenioEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(HsSuenioEnum).join(', ')}` })
  @IsOptional()
  readonly horas_suenio?: HsSuenioType;

  @ApiProperty({ description: 'Hidratacion del niño que asiste' })
  @IsNotEmpty({ message: 'Hidratacion no puede estar vacio' })
  @IsEnum(HidratacionEnum, { message: `No es una opcion válida. Valores permitidos: ${Object.values(HidratacionEnum).join(', ')}` })
  @IsOptional()
  readonly hidratacion?: HidratacionType;

  @ApiProperty({ description: 'Tiene diabetes' })
  @IsNotEmpty({ message: 'La diabetes no puede estar vacia' })
  @IsBoolean({ message: 'La diabetes debe ser un boleano' })
  @IsOptional()
  readonly diabetes?: boolean;

  @ApiProperty({ description: 'Tiene hipertensión arterial' })
  @IsNotEmpty({ message: 'La hipertensión no puede estar vacia' })
  @IsBoolean({ message: 'La hipertensión debe ser un boleano' })
  @IsOptional()
  readonly hta?: boolean;

  @ApiProperty({ description: 'Si la consulta es de nutricion o clinica' })
  @IsNotEmpty({ message: 'es_clinica no puede estar vacio' })
  @IsBoolean({ message: 'es_clinica debe ser un boleano' })
  readonly es_clinica: boolean;

  @ApiProperty({ description: 'Tiene obesidad' })
  @IsNotEmpty({ message: 'La obesidad no puede estar vacia' })
  @IsBoolean({ message: 'La obesidad debe ser un boleano' })
  @IsOptional()
  readonly obesidad?: boolean;

  @ApiProperty({ description: 'Consume alchol' })
  @IsNotEmpty({ message: 'Consumo de alchol no puede estar vacio' })
  @IsBoolean({ message: 'Consumo de alchol debe ser un boleano' })
  @IsOptional()
  readonly consumo_alcohol?: boolean;

  @ApiProperty({ description: 'Consume drogas' })
  @IsNotEmpty({ message: 'Consumo de drogas no puede estar vacio' })
  @IsBoolean({ message: 'Consumo de drogas debe ser un boleano' })
  @IsOptional()
  readonly consumo_drogas?: boolean;

  @ApiProperty({ description: 'Consume tabaco' })
  @IsNotEmpty({ message: 'Consumo de tabaco no puede estar vacio' })
  @IsBoolean({ message: 'Consumo de tabaco debe ser un boleano' })
  @IsOptional()
  readonly consumo_tabaco?: boolean;

  @ApiProperty({ description: 'Tiene antecedentes perinatal' })
  @IsNotEmpty({ message: 'Antecedente perinatal de drogas no puede estar vacio' })
  @IsBoolean({ message: 'Antecedente perinatal de drogas debe ser un boleano' })
  @IsOptional()
  readonly antecedentes_perinatal?: boolean;

  @ApiProperty({ description: 'Tiene enfermedades previas' })
  @IsNotEmpty({ message: 'Enfermedades previas no puede estar vaci' })
  @IsBoolean({ message: 'Enfermedades previas debe ser un boleano' })
  @IsOptional()
  readonly enfermedades_previas?: boolean;

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
  @IsOptional()
  readonly tas?: number;

  @ApiProperty({ description: 'La tension arterial diastolica del niño que asiste' })
  @IsNotEmpty({ message: 'La tension arterial diastolica no puede estar vacia' })
  @IsNumber({}, { message: 'La tension arterial diastolica debe ser un número' })
  @IsPositive({ message: 'La tension arterial diastolica debe ser un numero positivo' })
  @IsOptional()
  readonly tad?: number;

  @ApiProperty({ description: 'El percentillo de la tension arterial del niño que asiste' })
  @IsNotEmpty({ message: 'El percentillo de la tension arterial no puede estar vacio' })
  @IsNumber({}, { message: 'El percentillo de la tension arterial debe ser un número' })
  @IsPositive({ message: 'El percentillo de la tension arterial debe ser un numero positivo' })
  @IsOptional()
  readonly pcta?: number;

  @ApiProperty({ description: 'SEGTO del niño' })
  @IsNotEmpty({ message: 'SEGTO no puede estar vacio' })
  @IsBoolean({ message: 'SEGTO debe ser un boleano' })
  readonly segto: boolean;

  @ApiProperty({ description: 'Ingesta de leche del niño' })
  @IsNotEmpty({ message: 'Ingesta de leche no puede estar vacio' })
  @IsBoolean({ message: 'Ingesta de leche debe ser un boleano' })
  @IsOptional()
  readonly leche?: boolean;
}
