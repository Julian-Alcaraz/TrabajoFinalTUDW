import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';
import { ConjuntoConEnum, ConjuntoConType, DestinatariosEnum, DestinatariosType, DuracionEnum, DuracionType, FrecuenciaEnum, FrecuenciaType, TurnoTalleresEnum, TurnoTalleresType } from '../../common/const/const';

export class CreateTallerDto {
  @ApiProperty({ description: 'Nombre del taller' })
  @IsString({ message: 'El nombre del taller debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => (value ? value.trim() : value))
  readonly nombre: string;

  @ApiProperty({ description: 'Fecha del taller' })
  @IsNotEmpty({ message: 'La fecha de no puede estar vacia' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha del taller no tiene formato correcto' })
  readonly fecha: Date;

  @ApiProperty({ description: 'Cantidad de encuentros del taller' })
  @IsNotEmpty({ message: 'La cantidad de encuentros de no puede estar vacio' })
  @IsPositive({ message: 'La cantidad de encuentros debe ser un numero positivo' })
  @IsInt({ message: 'La cantidad de encuentros debe ser un entero' })
  readonly cantEncuentros: number;

  @ApiProperty({ description: 'Duracion del taller' })
  @IsNotEmpty({ message: 'La duracion del taller no puede estar vacia' })
  @IsEnum(DuracionEnum, { message: `No es una duración válida. Valores permitidos: ${Object.values(DuracionEnum).join(', ')}` })
  readonly duracion: DuracionType;

  @ApiProperty({ description: 'Cantidad de participantes del taller' })
  @IsNotEmpty({ message: 'La cantidad de participantes de no puede estar vacia' })
  @IsPositive({ message: 'La cantidad de participantes debe ser un numero positivo' })
  @IsInt({ message: 'La cantidad de participantes debe ser un entero' })
  readonly cantParticipantes: number;

  @ApiProperty({ description: 'Destinatarios del taller' })
  @IsNotEmpty({ message: 'Los destinatarios del taller no pueden estar vacios' })
  @IsEnum(DestinatariosEnum, { message: `No es un destinatario válida. Valores permitidos: ${Object.values(DestinatariosEnum).join(', ')}` })
  readonly destinatarios: DestinatariosType;

  @ApiProperty({ description: 'Observaciones de la consulta' })
  @IsString({ message: 'Las Observaciones debe ser un string' })
  @Length(1, 1000, { message: 'Las Observaciones deben tener entre 1 y 1000 caracteres' })
  @IsOptional()
  @Transform(({ value }) => (value ? value.trim() : value))
  readonly observaciones?: string;

  @ApiProperty({ description: 'Recursos del taller' })
  @IsString({ message: 'Los recursos del taller debe ser un string' })
  @Length(1, 100, { message: 'Los recursos deben tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => (value ? value.trim() : value))
  readonly recursos: string;

  @ApiProperty({ description: 'Turno del taller' })
  @IsNotEmpty({ message: 'El turno del taller no pueden estar vacio' })
  @IsEnum(TurnoTalleresEnum, { message: `No es un turno válido. Valores permitidos: ${Object.values(TurnoTalleresEnum).join(', ')}` })
  readonly turno: TurnoTalleresType;

  @ApiProperty({ description: 'En Conjunto con del taller' })
  @IsNotEmpty({ message: 'En Conjunto con del taller no puede estar vacio' })
  @IsEnum(ConjuntoConEnum, { message: `No es un valor válido. Valores permitidos: ${Object.values(ConjuntoConEnum).join(', ')}` })
  readonly conjuntoCon: ConjuntoConType;

  @ApiProperty({ description: 'Frecuencia con del taller' })
  @IsNotEmpty({ message: 'Frecuencia del taller no puede estar vacio' })
  @IsEnum(FrecuenciaEnum, { message: `No es un valor válido. Valores permitidos: ${Object.values(FrecuenciaEnum).join(', ')}` })
  readonly frecuencia: FrecuenciaType;

  // Relaciones

  @ApiProperty({ description: 'La institucion a la que va el niño' })
  @IsNotEmpty({ message: 'El id de la institucion no puede estar vacio' })
  @IsInt({ message: 'El id de la institucion debe ser un número' })
  @IsPositive({ message: 'El id de la institucion debe ser un numero positivo' })
  readonly id_institucion: number;

  @ApiProperty({ description: 'El curso del taller' })
  @IsNotEmpty({ message: 'El id del curso no puede estar vacio' })
  @IsInt({ message: 'El id del curso debe ser un número' })
  @IsPositive({ message: 'El id del curso debe ser un numero positivo' })
  readonly id_curso: number;

  @ApiProperty({ description: 'La especialidad del taller' })
  @IsNotEmpty({ message: 'El id de la especialidad no puede estar vacio' })
  @IsInt({ message: 'El id de la especialidad debe ser un número' })
  @IsPositive({ message: 'El id de la especialidad debe ser un numero positivo' })
  readonly id_especialidad: number;

  @ApiProperty({ description: 'El marco del taller' })
  @IsNotEmpty({ message: 'El id del marco no puede estar vacio' })
  @IsInt({ message: 'El id del marco debe ser un número' })
  @IsPositive({ message: 'El id del marco debe ser un numero positivo' })
  readonly id_marco: number;
}
