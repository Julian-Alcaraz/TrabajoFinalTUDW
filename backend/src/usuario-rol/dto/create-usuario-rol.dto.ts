import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateUsuarioRolDto {
  @ApiProperty({ description: 'Id del usuario' })
  @IsNotEmpty({ message: 'El id_usuario no puede estar vacio' })
  @IsPositive({ message: 'El id_usuario debe ser positivo' })
  @IsInt({ message: 'El id_usuario debe ser entero' })
  id_usuario: number;

  @ApiProperty({ description: 'Id del rol' })
  @IsNotEmpty({ message: 'El id_rol no puede estar vacio' })
  @IsPositive({ message: 'El id_rol debe ser positivo' })
  @IsInt({ message: 'El id_rol debe ser entero' })
  id_rol: number;
}
