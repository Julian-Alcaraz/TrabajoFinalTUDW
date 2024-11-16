import { IsBoolean } from 'class-validator';

export class DerivacionesDto {
  @IsBoolean({ message: 'La derivación Odontologia debe ser booleana' })
  // @IsOptional()
  odontologia: boolean;

  @IsBoolean({ message: 'La derivación Oftalmologia debe ser booleana' })
  // @IsOptional()
  oftalmologia: boolean;

  @IsBoolean({ message: 'La derivación Fonoaudiologia debe ser booleana' })
  // @IsOptional()
  fonoaudiologia: boolean;

  @IsBoolean({ message: 'La derivación Externa debe ser booleana' })
  // @IsOptional()
  externa: boolean;
}
