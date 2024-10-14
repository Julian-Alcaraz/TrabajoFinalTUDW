import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCursoDto } from './create-curso.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCursoDto extends PartialType(CreateCursoDto) {
  @ApiProperty({ description: 'Indica si el curso esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  readonly deshabilitado?: boolean;
}
