import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoriaDto {
  @ApiProperty({ description: 'Nombre de la categoria de la consulta de trabajo social' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 50, { message: 'El nombre debe tener entre 1 y 50 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly nombre: string;
}
