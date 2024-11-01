import { IsBoolean, IsOptional } from 'class-validator';

export class DerivacionesDto {
  // @IsBoolean()
  // Clinica: boolean;

  @IsBoolean({ message: 'La derivación Odontologia debe ser booleana' })
  @IsOptional()
  Odontologia?: boolean;

  @IsBoolean({ message: 'La derivación Oftalmologia debe ser booleana' })
  @IsOptional()
  Oftalmologia?: boolean;

  @IsBoolean({ message: 'La derivación Fonoaudiologia debe ser booleana' })
  @IsOptional()
  Fonoaudiologia?: boolean;

  @IsBoolean({ message: 'La derivación Externa debe ser booleana' })
  @IsOptional()
  Externa?: boolean;
}
