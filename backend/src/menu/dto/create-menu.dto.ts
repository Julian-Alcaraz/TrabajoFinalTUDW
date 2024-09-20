import { Length, IsNotEmpty, IsString, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: 'Label del menu' })
  @IsNotEmpty({ message: 'El label no puede estar vacio' })
  @IsString({ message: 'El label debe ser un string' })
  @Length(1, 100, { message: 'El label debe tener entre 1 y 100 caracteres' })
  label: string;

  @ApiProperty({ description: 'URL del menu' })
  @IsNotEmpty({ message: 'La URL no puede estar vacía' })
  @IsString({ message: 'La URL debe ser un string' })
  @Length(1, 100, { message: 'La URL debe tener entre 1 y 100 caracteres' })
  url: string;

  @ApiProperty({ description: 'Orden en el que se mostrará el menu' })
  @IsNotEmpty({ message: 'El orden no puede estar vacío' })
  @IsInt({ message: 'El orden debe ser un número entero' })
  orden: number;

  @ApiProperty({ description: 'Icon del menu' })
  @IsNotEmpty({ message: 'El icon no puede estar vacío' })
  @IsString({ message: 'La icon debe ser un string' })
  @IsOptional()
  icon?: string;

  @ApiProperty({ description: 'ID del padre del menú' })
  @IsInt({ message: 'El ID del padre debe ser un número entero' })
  @IsPositive({ message: 'El ID del padre debe ser un número positivo' })
  @IsOptional()
  menu_padre?: number;
}
