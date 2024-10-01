import { Length, IsNotEmpty, IsString, IsInt, IsOptional, IsPositive, IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: 'Label del menu' })
  @IsNotEmpty({ message: 'El label no puede estar vacio' })
  @IsString({ message: 'El label debe ser un string' })
  @Length(1, 100, { message: 'El label debe tener entre 1 y 100 caracteres' })
  readonly label: string;

  @ApiProperty({ description: 'URL del menu' })
  @IsNotEmpty({ message: 'La URL no puede estar vacía' })
  @IsString({ message: 'La URL debe ser un string' })
  @Length(1, 100, { message: 'La URL debe tener entre 1 y 100 caracteres' })
  readonly url: string;

  @ApiProperty({ description: 'Orden en el que se mostrará el menu' })
  @IsNotEmpty({ message: 'El orden no puede estar vacio' })
  @IsInt({ message: 'El orden debe ser un numero entero' })
  @IsPositive({ message: 'El orden debe ser positivo' })
  readonly orden: number;

  @ApiProperty({ description: 'IDS de los roles relacionados con el menu' })
  @IsArray({ message: 'Los roles_ids deben ser un arreglo' })
  @ArrayNotEmpty({ message: 'El arreglo roles_ids no puede estar vacio' })
  @IsNumber({}, { each: true, message: 'Cada elemento del arreglo roles_ids debe ser un numero' })
  @IsPositive({ each: true, message: 'Cada elemento del arreglo roles_ids debe ser un numero positivo' })
  @IsInt({ each: true, message: 'Cada elemento del arreglo roles_ids debe ser un numero entero' })
  readonly roles_ids: number[];

  @ApiProperty({ description: 'Icon del menu' })
  @IsString({ message: 'El icon debe ser un string' })
  @IsOptional()
  readonly icon?: string;

  @ApiProperty({ description: 'ID del padre del menu' })
  @IsInt({ message: 'El ID del padre debe ser un número entero' })
  @IsPositive({ message: 'El ID del padre debe ser un número positivo' })
  @IsOptional()
  readonly menu_padre?: number;
}
