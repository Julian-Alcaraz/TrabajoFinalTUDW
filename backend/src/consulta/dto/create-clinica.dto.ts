import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Length, Matches } from 'class-validator';

export class CreateClinicaDto {
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

  // ENUM incompleto completo desconoce
  @ApiProperty({ description: 'Tiene Vacunas' })
  @IsNotEmpty({ message: 'Las vacunas no pueden estar vacias' })
  @IsString({ message: 'Vacunas debe ser un string' })
  @Length(1, 100, { message: 'Las vacunas social debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly vacunas: string;

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

  // imc no lo agrego al dto por que lo calculamos en el back

  @ApiProperty({ description: 'El percentillo de imc del niño que asiste' })
  @IsNotEmpty({ message: 'El percentillo de imc no puede estar vacia' })
  @IsNumber({}, { message: 'El percentillo de imc debe ser un número' })
  @IsPositive({ message: 'El percentillo de imc debe ser un numero positivo' })
  readonly pcimc: number;

  // Estado nutricional se calcula y se guarda.

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

  // TA se calcula

  // ENUM normal anormal
  @ApiProperty({ description: 'Examen visual del niño que asiste' })
  @IsNotEmpty({ message: 'El examen visual no puede estar vacio' })
  @IsString({ message: 'El examen visual debe ser un string' })
  @Length(1, 100, { message: 'El examen visual debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly examen_visual: string;

  // ENUM normal anormal
  @ApiProperty({ description: 'Ortopedia y traumatologia del niño que asiste' })
  @IsNotEmpty({ message: 'Ortopedia y traumatologia no puede estar vacio' })
  @IsString({ message: 'Ortopedia y traumatologia debe ser un string' })
  @Length(1, 100, { message: 'Ortopedia y traumatologia debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly ortopedia_traumatologia: string;

  // ENUM adecuado inadecuado
  @ApiProperty({ description: 'Lenguaje del niño que asiste' })
  @IsNotEmpty({ message: 'Lenguaje no puede estar vacio' })
  @IsString({ message: 'Lenguaje debe ser un string' })
  @Length(1, 100, { message: 'Lenguaje debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly lenguaje: string;

  @ApiProperty({ description: 'SEGTO del niño' })
  @IsNotEmpty({ message: 'SEGTO no puede estar vacio' })
  @IsBoolean({ message: 'SEGTO debe ser un boleano' })
  readonly segto: boolean;

  @ApiProperty({ description: 'Alimentacion del niño que asiste' })
  @IsNotEmpty({ message: 'Alimentacion no puede estar vacio' })
  @IsString({ message: 'Alimentacion debe ser un string' })
  @Length(1, 100, { message: 'Alimentacion debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly alimentacion: string;

  @ApiProperty({ description: 'Hidratacion del niño que asiste' })
  @IsNotEmpty({ message: 'Hidratacion no puede estar vacio' })
  @IsString({ message: 'Hidratacion debe ser un string' })
  @Length(1, 100, { message: 'Hidratacion debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly hidratacion: string;

  @ApiProperty({ description: 'Ingesta de leche del niño' })
  @IsNotEmpty({ message: 'Ingesta de leche no puede estar vacio' })
  @IsBoolean({ message: 'Ingesta de leche debe ser un boleano' })
  readonly leche: boolean;

  @ApiProperty({ description: 'Ingesta de infusiones del niño' })
  @IsNotEmpty({ message: 'Ingesta de infusiones no puede estar vacio' })
  @IsString({ message: 'Ingesta de infusiones debe ser un string' })
  @Length(1, 100, { message: 'Ingesta de infusiones debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly infusiones: string;

  @ApiProperty({ description: 'Cantidad de comidas del niño que asiste' })
  @IsNotEmpty({ message: 'Cantidad de comidas  no puede estar vacio' })
  @IsString({ message: 'Numero de comidas debe ser un string' })
  @Length(1, 100, { message: 'Numero de comidas debe tener entre 1 y 100 caracteres' })
  readonly cantidad_comidas: string;

  @ApiProperty({ description: 'Horas de pantallas diarias' })
  @IsNotEmpty({ message: 'La hora no puede estar vacía' })
  @IsString({ message: 'Horas de pantallas debe ser un string' })
  @Length(1, 100, { message: 'Horas de pantallas debe tener entre 1 y 100 caracteres' })
  // @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm' })
  readonly horas_pantalla: string;

  @ApiProperty({ description: 'Horas de juego al aire libre' })
  @IsNotEmpty({ message: 'Las horas de juego al aire libre no puede estar vacía' })
  @IsString({ message: 'Horas de juego al aire libre debe ser un string' })
  @Length(1, 100, { message: 'Horas de juego al aire libre debe tener entre 1 y 100 caracteres' })
  // @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm' })
  readonly horas_juego_aire_libre: string;

  @ApiProperty({ description: 'Horas de sueño' })
  @IsNotEmpty({ message: 'Las horas de sueño no puede estar vacía' })
  @IsString({ message: 'Horas de sueño debe ser un string' })
  @Length(1, 100, { message: 'Horas de sueño debe tener entre 1 y 100 caracteres' })
  // @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm' })
  readonly horas_suenio: string;

  // @ApiProperty({ description: 'Proyecto del niño que asiste' })
  // @IsNotEmpty({ message: 'Proyecto no puede estar vacio' })
  // @IsString({ message: 'Proyecto debe ser un string' })
  // @Length(1, 100, { message: 'Proyecto debe tener entre 1 y 100 caracteres' })
  // @Transform(({ value }) => value.trim())
  // readonly proyecto: string;
}
