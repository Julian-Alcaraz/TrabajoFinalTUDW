import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateMenuRolDto {
  @ApiProperty({ description: 'Id del menu' })
  @IsNotEmpty({ message: 'El id_menu no puede estar vacio' })
  @IsPositive({ message: 'El id_menu debe ser positivo' })
  @IsInt({ message: 'El id_menu debe ser entero' })
  id_menu: number;

  @ApiProperty({ description: 'Id del rol' })
  @IsNotEmpty({ message: 'El id_rol no puede estar vacio' })
  @IsPositive({ message: 'El id_rol debe ser positivo' })
  @IsInt({ message: 'El id_rol debe ser entero' })
  id_rol: number;
}
