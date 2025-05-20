import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateSocialDto {
  @ApiProperty({ description: 'Demanda del niño que asiste' })
  @IsString({ message: 'La demanda debe ser un texto' })
  @IsNotEmpty({ message: 'La demanda no puede estar vacía' })
  readonly demanda: string;

  @ApiProperty({ description: 'Articulación relacionada con la consulta' })
  @IsString({ message: 'La articulación debe ser un texto' })
  readonly articulacion: string;

  @ApiProperty({ description: 'Objeto del informe asociado' })
  @IsString({ message: 'El objeto del informe debe ser un texto' })
  readonly objeto_informe: string;

  @ApiProperty({ description: 'Seguimiento realizado para el caso' })
  @IsString({ message: 'El seguimiento debe ser un texto' })
  readonly seguimiento: string;

  @ApiProperty({ description: 'IDS de los roles relacionados con el menu' })
  @IsArray({ message: 'Los roles_ids deben ser un arreglo' })
  @ArrayNotEmpty({ message: 'El arreglo no puede estar vacio' })
  @IsNumber({}, { each: true, message: 'Cada elemento del arreglo debe ser un numero' })
  @IsPositive({ each: true, message: 'Cada elemento del arreglo debe ser un numero positivo' })
  @IsInt({ each: true, message: 'Cada elemento del arreglo debe ser un numero entero' })
  readonly categorias_ids: number[];
}
