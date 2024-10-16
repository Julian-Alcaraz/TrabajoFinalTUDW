import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateInstitucionDto } from './create-institucion.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateInstitucionDto extends PartialType(CreateInstitucionDto) {
  @ApiProperty({ description: 'Indica si la institucion esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  readonly deshabilitado?: boolean;
}
