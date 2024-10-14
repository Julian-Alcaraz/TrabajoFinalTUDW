import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChicoDto } from './create-chico.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChicoDto extends PartialType(CreateChicoDto) {
  @ApiProperty({ description: 'Indica si el chico esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  readonly deshabilitado?: boolean;
}
