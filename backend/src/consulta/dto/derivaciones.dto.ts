import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class DerivacionesDto {
  @Transform(({ value }) => value ?? false)
  @IsBoolean({ message: 'La derivación Odontologia debe ser booleana' })
  // @IsOptional()
  odontologia: boolean;

  @Transform(({ value }) => value ?? false)
  @IsBoolean({ message: 'La derivación Oftalmologia debe ser booleana' })
  // @IsOptional()
  oftalmologia: boolean;

  @Transform(({ value }) => value ?? false)
  @IsBoolean({ message: 'La derivación Fonoaudiologia debe ser booleana' })
  // @IsOptional()
  fonoaudiologia: boolean;

  @Transform(({ value }) => value ?? false)
  @IsBoolean({ message: 'La derivación Externa debe ser booleana' })
  // @IsOptional()
  externa: boolean;
}
