import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEspecialidadDto } from './create-especialidad.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {
  @ApiProperty({ description: 'Indica si la especialidad esta deshabilitada' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
