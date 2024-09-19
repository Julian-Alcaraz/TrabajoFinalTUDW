import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateRolDto } from './create-rol.dto';

// Al ser extends PartialType(CreateRolDto), los campos del create ya estan aca de manera opcional
export class UpdateRolDto extends PartialType(CreateRolDto) {
  @ApiProperty({ description: 'Indica si el rol esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
