import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBarrioDto } from './create-barrio.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateBarrioDto extends PartialType(CreateBarrioDto) {
  @ApiProperty({ description: 'Indica si el Barrio esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
