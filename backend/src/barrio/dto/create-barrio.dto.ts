import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class CreateBarrioDto {
  @ApiProperty({ description: 'Nombre del Barrio' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  readonly nombre: string;

  @ApiProperty({ description: 'Id de la Localidad en la que esta.' })
  @IsNotEmpty({ message: 'El id de localidad no puede estar vacio' })
  @IsInt({ message: 'El id de localidad debe ser un number' })
  @IsPositive({ message: 'El id de la localidad debe ser un numero positivo' })
  readonly id_localidad: number;
}
