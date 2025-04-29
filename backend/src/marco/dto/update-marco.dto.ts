import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateMarcoDto } from './create-marco.dto';
export class UpdateMarcoDto extends PartialType(CreateMarcoDto) {
  @ApiProperty({ description: 'Indica si la especialidad esta deshabilitada' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
