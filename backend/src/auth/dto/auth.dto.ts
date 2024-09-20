import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayloadDto {
  @ApiProperty({ description: 'Email del usuario' })
  @IsNotEmpty({ message: 'El email no puede estar vacio' })
  @IsEmail({}, { message: 'El email debe ser un email' })
  email: string;

  @ApiProperty({ description: 'Contrasenia del usuario' })
  @IsNotEmpty({ message: 'La contrasenia no puede estar vacia' })
  @IsString({ message: 'La contrasenia debe ser un string' })
  @Length(1, 100, { message: 'La contrasenia debe tener entre 1 y 100 caracteres' })
  contrasenia: string;
}
