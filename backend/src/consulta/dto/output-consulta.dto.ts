import { ApiProperty } from '@nestjs/swagger';
import { CreateConsultaDto } from './create-consulta.dto';
import { Transform } from 'class-transformer';
import { lightFormat } from 'date-fns';

export class OutputConsultaDto extends CreateConsultaDto {
  @ApiProperty({ description: 'Fecha de la consulta' })
  @Transform(({ value }) => (value ? lightFormat(new Date(value), 'dd-MM-yyyy') : null))
  readonly created_at: string;
}
