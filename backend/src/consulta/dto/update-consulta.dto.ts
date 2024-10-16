import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateConsultaDto } from './create-consulta.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {
  @ApiProperty({ description: 'Indica si la consulta esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  readonly deshabilitado?: boolean;
}
