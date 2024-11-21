import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { nivelCurso } from '../entities/curso.entity';
import { Transform } from 'class-transformer';

export class CreateCursoDto {
  @ApiProperty({ description: 'Nivel del chico' })
  @IsNotEmpty({ message: 'El Nivel no puede estar vacio' })
  @IsEnum(['Jardin', 'Primario', 'Secundario'], { message: 'No es un nivel valido. Jardin, Primario' })
  readonly nivel: nivelCurso;

  @ApiProperty({ description: 'Nombre del curso' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly nombre: string;
}
