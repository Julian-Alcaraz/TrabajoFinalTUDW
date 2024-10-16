import { ApiProperty } from '@nestjs/swagger';
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
  readonly consumo_alchol: boolean;

  @ApiProperty({ description: 'Consume drogas' })
  @IsNotEmpty({ message: 'Consumo de drogas no puede estar vacio' })
  @IsBoolean({ message: 'Consumo de drogas debe ser un boleano' })
  readonly consumo_drogas: boolean;

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

  // que hago con esto
  @ApiProperty({ description: 'El percentillo de imc del niño que asiste' })
  @IsNotEmpty({ message: 'El percentillo de imc no puede estar vacia' })
  @IsNumber({}, { message: 'El percentillo de imc debe ser un número' })
  @IsPositive({ message: 'El percentillo de imc debe ser un numero positivo' })
  readonly pcimc: number;

  // Estado nutricional se calcula y se guarda.

  @ApiProperty({ description: 'La tension arterial sistolica del niño que asiste' })
  @IsNotEmpty({ message: 'La tension arterial sistolica no puede estar vacia' })
  @IsInt({ message: 'La tension arterial sistolica debe ser un número' })
  @IsPositive({ message: 'La tension arterial sistolica debe ser un numero positivo' })
  readonly tas: number;

  @ApiProperty({ description: 'La tension arterial diastolica del niño que asiste' })
  @IsNotEmpty({ message: 'La tension arterial diastolica no puede estar vacia' })
  @IsInt({ message: 'La tension arterial diastolica debe ser un número' })
  @IsPositive({ message: 'La tension arterial diastolica debe ser un numero positivo' })
  readonly tad: number;

  @ApiProperty({ description: 'El percentillo de la tension arterial del niño que asiste' })
  @IsNotEmpty({ message: 'El percentillo de la tension arterial no puede estar vacio' })
  @IsInt({ message: 'El percentillo de la tension arterial debe ser un número' })
  @IsPositive({ message: 'El percentillo de la tension arterial debe ser un numero positivo' })
  readonly pcta: number;

  // TA se calcula

  // ENUM normal anormal
  @ApiProperty({ description: 'Examen visual del niño que asiste' })
  @IsNotEmpty({ message: 'El examen visual no puede estar vacio' })
  @IsString({ message: 'El examen visual debe ser un string' })
  @Length(1, 100, { message: 'El examen visual debe tener entre 1 y 100 caracteres' })
  readonly examen_visual: string;

  // ENUM normal anormal
  @ApiProperty({ description: 'Ortopedia y traumatologia del niño que asiste' })
  @IsNotEmpty({ message: 'Ortopedia y traumatologia no puede estar vacio' })
  @IsString({ message: 'Ortopedia y traumatologia debe ser un string' })
  @Length(1, 100, { message: 'Ortopedia y traumatologia debe tener entre 1 y 100 caracteres' })
  readonly ortopedia_traumatologia: string;

  // ENUM adecuado inadecuado
  @ApiProperty({ description: 'Lenguaje del niño que asiste' })
  @IsNotEmpty({ message: 'Lenguaje no puede estar vacio' })
  @IsString({ message: 'Lenguaje debe ser un string' })
  @Length(1, 100, { message: 'Lenguaje debe tener entre 1 y 100 caracteres' })
  readonly lenguaje: string;

  @ApiProperty({ description: 'SEGTO del niño' })
  @IsNotEmpty({ message: 'SEGTO no puede estar vacio' })
  @IsBoolean({ message: 'SEGTO debe ser un boleano' })
  readonly segto: boolean;

  @ApiProperty({ description: 'Alimentacion del niño que asiste' })
  @IsNotEmpty({ message: 'Alimentacion no puede estar vacio' })
  @IsString({ message: 'Alimentacion debe ser un string' })
  @Length(1, 100, { message: 'Alimentacion debe tener entre 1 y 100 caracteres' })
  readonly alimentacion: string;

  @ApiProperty({ description: 'Hidratacion del niño que asiste' })
  @IsNotEmpty({ message: 'Hidratacion no puede estar vacio' })
  @IsString({ message: 'Hidratacion debe ser un string' })
  @Length(1, 100, { message: 'Hidratacion debe tener entre 1 y 100 caracteres' })
  readonly hidratacion: string;

  @ApiProperty({ description: 'Ingesta de lacteos del niño' })
  @IsNotEmpty({ message: 'Ingesta de lacteos no puede estar vacio' })
  @IsBoolean({ message: 'Ingesta de lacteos debe ser un boleano' })
  readonly lacteos: boolean;

  @ApiProperty({ description: 'Ingesta de infuciones del niño' })
  @IsNotEmpty({ message: 'Ingesta de infuciones no puede estar vacio' })
  @IsBoolean({ message: 'Ingesta de infuciones debe ser un boleano' })
  readonly infuciones: boolean;

  @ApiProperty({ description: 'Numero de comidas del niño que asiste' })
  @IsNotEmpty({ message: 'Numero de comidas  no puede estar vacio' })
  @IsInt({ message: 'Numero de comidas  debe ser un número' })
  @IsPositive({ message: 'Numero de comidas debe ser un numero positivo' })
  readonly numero_comidas: number;

  @ApiProperty({ description: 'Horas de pantallas diarias' })
  @IsNotEmpty({ message: 'La hora no puede estar vacía' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm' })
  readonly horas_pantalla: string;

  @ApiProperty({ description: 'Horas de juegeo aire libre' })
  @IsNotEmpty({ message: 'La hora no puede estar vacía' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm' })
  readonly horas_juego_airelibre: string;

  @ApiProperty({ description: 'Horas de sueño diarias' })
  @IsNotEmpty({ message: 'La hora no puede estar vacía' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe estar en formato HH:mm' })
  readonly horas_suenio: string;

  @ApiProperty({ description: 'Proyecto del niño que asiste' })
  @IsNotEmpty({ message: 'Proyecto no puede estar vacio' })
  @IsString({ message: 'Proyecto debe ser un string' })
  @Length(1, 100, { message: 'Proyecto debe tener entre 1 y 100 caracteres' })
  readonly proyecto: string;
}
