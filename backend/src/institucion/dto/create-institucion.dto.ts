import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { tiposInstitucion } from '../entities/institucion.entity';

export class CreateInstitucionDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  readonly nombre: string;

  @IsEnum(['Jardin', 'Primario', 'Secundario', 'Terciario'])
  @IsNotEmpty({ message: 'El tipo de institución no puede estar vacio' })
  tipo: tiposInstitucion;
}
