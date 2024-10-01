import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateRolDto } from './create-rol.dto';

export class UpdateRolDto extends PartialType(CreateRolDto) {
  @ApiProperty({ description: 'Indica si el rol esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
