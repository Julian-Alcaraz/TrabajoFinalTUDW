import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLocalidadDto } from './create-localidad.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLocalidadDto extends PartialType(CreateLocalidadDto) {
  @ApiProperty({ description: 'Indica si la localida esta deshabilitada' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  readonly deshabilitado?: boolean;
}
