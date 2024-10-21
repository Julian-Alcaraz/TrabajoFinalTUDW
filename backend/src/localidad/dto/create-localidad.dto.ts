import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLocalidadDto {
  @ApiProperty({ description: 'Nombre de la localidad.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio.' })
  @IsString({ message: 'El nombre debe ser un string.' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres.' })
  @Transform(({ value }) => value.trim())
  readonly nombre: string;
}
