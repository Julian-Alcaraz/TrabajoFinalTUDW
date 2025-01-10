import { ApiProperty } from '@nestjs/swagger';

export class OutputUsuarioDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  readonly nombre: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  readonly apellido: string;

  @ApiProperty({ description: 'Dni del usuario' })
  readonly dni: number;

  @ApiProperty({ description: 'Email del usuario' })
  readonly email: string;

  @ApiProperty({ description: 'Fecha nacimiento del usuario' })
  readonly fe_nacimiento: Date;

  @ApiProperty({ description: 'IDS de los roles relacionados con el menu' })
  readonly roles_ids: number[];
}
