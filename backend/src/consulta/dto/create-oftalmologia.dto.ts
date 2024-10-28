import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOftalmologiaDto {
  @ApiProperty({ description: 'Demanada de la consulta' })
  @IsNotEmpty({ message: 'La demanda no puede estar vacia' })
  @IsString({ message: 'La demanda debe ser un string' })
  @Length(1, 100, { message: 'La demanda debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly demanda: string;

  @ApiProperty({ description: 'Primera vez' })
  @IsNotEmpty({ message: 'Primera vez no puede estar vacia' })
  @IsBoolean({ message: 'Primera vez debe ser un boleano' })
  readonly primera_vez: boolean;

  @ApiProperty({ description: 'Control' })
  @IsNotEmpty({ message: 'Control no puede estar vacia' })
  @IsBoolean({ message: 'Control debe ser un boleano' })
  readonly control: boolean;

  @ApiProperty({ description: 'Receta' })
  @IsNotEmpty({ message: 'Receta no puede estar vacia' })
  @IsBoolean({ message: 'Receta debe ser un boleano' })
  readonly receta: boolean;

  @ApiProperty({ description: 'Fecha proximo control del chico.' })
  @IsNotEmpty({ message: 'La fecha del proximo control no puede estar vacia' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha del proximo control no tiene formato correcto' })
  readonly prox_control: Date;

  @ApiProperty({ description: 'Anteojos' })
  @IsNotEmpty({ message: 'Anteojos no puede estar vacio' })
  @IsBoolean({ message: 'Anteojos debe ser un boleano' })
  readonly anteojos: boolean;
}
