import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ description: 'Indica si el menu esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
