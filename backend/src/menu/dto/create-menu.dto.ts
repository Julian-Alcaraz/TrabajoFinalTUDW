import { ApiProperty } from '@nestjs/swagger';
import { Length, IsNotEmpty, IsString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: 'Nombre del menu' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  nombre: string;

  @ApiProperty({ description: 'URL del menu' })
  @IsNotEmpty({ message: 'La URL no puede estar vacía' })
  @IsString({ message: 'La URL debe ser un string' })
  @Length(1, 100, { message: 'La url debe tener entre 1 y 100 caracteres' })
  url: string;

  @ApiProperty({ description: 'Orden en el que se mostrará el menú' })
  @IsNotEmpty({ message: 'El orden no puede estar vacío' })
  @IsInt({ message: 'El orden debe ser un número entero' })
  orden: number;

  @ApiProperty({ description: 'ID del padre del menú' })
  @IsInt({ message: 'El ID del padre debe ser un número entero' })
  @IsPositive({ message: 'El ID del padre debe ser un número positivo' })
  @IsOptional()
  menu_padre?: number;
}
