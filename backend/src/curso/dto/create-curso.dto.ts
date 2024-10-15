import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';
import { nivelCurso } from '../entities/curso.entity';

export class CreateCursoDto {
  @ApiProperty({ description: 'Grado del curso.' })
  @IsNotEmpty({ message: 'El grado no puede estar vacio' })
  @IsInt({ message: 'El grado debe ser un number' })
  @IsPositive({ message: 'El grado debe ser un numero positivo' })
  readonly grado: number;

  @ApiProperty({ description: 'Nivel del chico' })
  @IsNotEmpty({ message: 'El Nivel no puede estar vacio' })
  @IsEnum(['Primaria', 'Secundario', 'Jardin', 'Terciario', 'Universitario'])
  readonly nivel: nivelCurso;

  @ApiProperty({ description: 'Nombre del curso' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  readonly nombre: string;
}
