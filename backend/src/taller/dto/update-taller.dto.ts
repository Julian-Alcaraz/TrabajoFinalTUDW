import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateTallerDto } from './create-taller.dto';
export class UpdateTallerDto extends PartialType(CreateTallerDto) {
  @ApiProperty({ description: 'Indica si el taller esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
