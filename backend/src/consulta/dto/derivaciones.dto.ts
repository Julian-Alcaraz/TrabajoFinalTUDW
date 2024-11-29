import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class DerivacionesDto {
  @IsBoolean({ message: 'La derivación Odontologia debe ser booleana' })
  // @IsOptional()
  @Transform(({ value }) => value ?? false)
  odontologia: boolean;

  @IsBoolean({ message: 'La derivación Oftalmologia debe ser booleana' })
  // @IsOptional()
  @Transform(({ value }) => value ?? false)
  oftalmologia: boolean;

  @IsBoolean({ message: 'La derivación Fonoaudiologia debe ser booleana' })
  // @IsOptional()
  @Transform(({ value }) => value ?? false)
  fonoaudiologia: boolean;

  @IsBoolean({ message: 'La derivación Externa debe ser booleana' })
  // @IsOptional()
  @Transform(({ value }) => value ?? false)
  externa: boolean;
}
