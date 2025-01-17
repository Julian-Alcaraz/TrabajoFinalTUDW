import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRolDto {
  @ApiProperty({ description: 'Nombre del rol' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @IsString({ message: 'El nombre debe ser un string' })
  @Length(1, 50, { message: 'El nombre debe tener entre 1 y 50 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly nombre: string;
}
