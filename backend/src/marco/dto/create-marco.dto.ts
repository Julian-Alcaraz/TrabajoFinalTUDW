import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class CreateMarcoDto {
  @ApiProperty({ description: 'Nombre del marco' })
  @IsString({ message: 'El nombre del marco debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => (value ? value.trim() : value))
  readonly nombre: string;

  // Relaciones

  @ApiProperty({ description: 'La especialidad del marco' })
  @IsNotEmpty({ message: 'El id de la especialidad no puede estar vacio' })
  @IsInt({ message: 'El id de la especialidad debe ser un número' })
  @IsPositive({ message: 'El id de la especialidad debe ser un numero positivo' })
  readonly id_especialidad: number;
}
