import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, Length, Min } from 'class-validator';

export class CreateOdontologiaDto {
  @ApiProperty({ description: 'Primera vez del niño que asiste a la consulta' })
  @IsNotEmpty({ message: 'El campo primera vez no puede estar vacia' })
  @IsBoolean({ message: 'El campo primera vez debe ser un boleano' })
  readonly primera_vez: boolean;

  @ApiProperty({ description: 'Ulterior del niño que asiste a la consulta' })
  @IsNotEmpty({ message: 'La hipertensión no puede estar vacia' })
  @IsBoolean({ message: 'La hipertensión debe ser un boleano' })
  readonly ulterior: boolean;

  @ApiProperty({ description: 'Dientes permanentes del niño que asiste' })
  @IsNotEmpty({ message: 'Los Dientes permanentes no puede estar vacios' })
  @IsInt({ message: 'Los Dientes permanentes  debe ser un número' })
  @Min(0, { message: 'Dientes no recuperables debe ser un número positivo o cero' })
  readonly dientes_permanentes: number;

  @ApiProperty({ description: 'Dientes temporales del niño que asiste' })
  @IsNotEmpty({ message: 'los Dientes temporales no puede estar vacios' })
  @IsInt({ message: 'Los Dientes temporales  debe ser un número' })
  @Min(0, { message: 'Dientes no recuperables debe ser un número positivo o cero' })
  readonly dientes_temporales: number;

  @ApiProperty({ description: 'Sellador del niño que asiste' })
  @IsNotEmpty({ message: 'Sellador no puede estar vacios' })
  @IsInt({ message: 'Sellador debe ser un número' })
  @Min(0, { message: 'Dientes no recuperables debe ser un número positivo o cero' })
  readonly sellador: number;

  @ApiProperty({ description: 'Topificacion del niño que asiste a la consulta' })
  @IsNotEmpty({ message: 'Topificacion no puede estar vacia' })
  @IsBoolean({ message: 'Topificacion debe ser un boleano' })
  readonly topificacion: boolean;

  @ApiProperty({ description: 'Cepillado del niño que asiste a la consulta' })
  @IsNotEmpty({ message: ' Cepillado no puede estar vacio' })
  @IsBoolean({ message: 'Cepillado debe ser un boleano' })
  readonly cepillado: boolean;

  // @ApiProperty({ description: 'Derivacion del niño que asiste a la consulta' })
  // @IsNotEmpty({ message: 'Derivacion no puede estar vacio' })
  // @IsBoolean({ message: 'Derivacion debe ser un boleano' })
  // readonly derivacion: boolean;

  @ApiProperty({ description: 'Dientes recuperables del niño que asiste' })
  @IsNotEmpty({ message: 'Dientes recuperables no puede estar vacio' })
  @IsInt({ message: 'Dientes recuperables debe ser un número' })
  @Min(0, { message: 'Dientes no recuperables debe ser un número positivo o cero' })
  readonly dientes_recuperables: number;

  @ApiProperty({ description: 'Dientes no recuperables del niño que asiste' })
  @IsNotEmpty({ message: 'Dientes no recuperables no puede estar vacio' })
  @IsInt({ message: 'Dientes no recuperables debe ser un número' })
  @Min(0, { message: 'Dientes no recuperables debe ser un número positivo o cero' })
  readonly dientes_irecuperables: number;

  @ApiProperty({ description: 'Cepillo del niño que asiste a la consulta' })
  @IsNotEmpty({ message: ' Cepillo no puede estar vacio' })
  @IsBoolean({ message: 'Cepillo debe ser un boleano' })
  readonly cepillo: boolean;

  @ApiProperty({ description: 'Habitos del niño que asiste' })
  @IsNotEmpty({ message: 'Habitos no puede estar vacio' })
  @IsString({ message: 'Habitos debe ser un string' })
  @Length(1, 100, { message: 'Habitos debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value.trim())
  readonly habitos: string;

  // @ApiProperty({ description: 'Estado situacional bucal del niño que asiste' })
  // @IsNotEmpty({ message: 'Estado situacional bucal no puede estar vacio' })
  // @IsString({ message: 'Estado situacional bucal debe ser un string' })
  // @Length(1, 100, { message: 'Estado situacional bucal debe tener entre 1 y 100 caracteres' })
  // @Transform(({ value }) => value.trim())
  // readonly situacion_bucal: string;

  // CLASIFICACION SE CALCULA Y ES STRING este tambien incluir en entidad
}
