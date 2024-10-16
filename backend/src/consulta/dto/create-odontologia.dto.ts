import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, Length } from 'class-validator';

export class CreateOdontologiaDto {
  // el id no lo verificp?

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
  @IsPositive({ message: 'Los Dientes permanentes debe ser un numero positivo' })
  readonly dientes_permanentes: number;

  @ApiProperty({ description: 'Dientes temporales del niño que asiste' })
  @IsNotEmpty({ message: 'los Dientes temporales no puede estar vacios' })
  @IsInt({ message: 'Los Dientes temporales  debe ser un número' })
  @IsPositive({ message: 'Los Dientes temporales debe ser un numero positivo' })
  readonly dientes_temporales: number;

  @ApiProperty({ description: 'Sellador del niño que asiste' })
  @IsNotEmpty({ message: 'Sellador no puede estar vacios' })
  @IsInt({ message: 'Sellador debe ser un número' })
  @IsPositive({ message: 'Sellador debe ser un numero positivo' })
  readonly sellador: number;

  @ApiProperty({ description: 'Topificacion del niño que asiste a la consulta' })
  @IsNotEmpty({ message: 'Topificacion no puede estar vacia' })
  @IsBoolean({ message: 'Topificacion debe ser un boleano' })
  readonly topificacion: boolean;

  @ApiProperty({ description: 'Cepillado del niño que asiste a la consulta' })
  @IsNotEmpty({ message: ' Cepillado no puede estar vacio' })
  @IsBoolean({ message: 'Cepillado debe ser un boleano' })
  readonly cepillado: boolean;

  @ApiProperty({ description: 'Derivacion del niño que asiste a la consulta' })
  @IsNotEmpty({ message: 'Derivacion no puede estar vacio' })
  @IsBoolean({ message: 'Derivacion debe ser un boleano' })
  readonly derivacion: boolean;

  @ApiProperty({ description: 'Dientes recuperables del niño que asiste' })
  @IsNotEmpty({ message: 'Dientes recuperables no puede estar vacio' })
  @IsInt({ message: 'Dientes recuperables debe ser un número' })
  @IsPositive({ message: 'Dientes recuperables debe ser un numero positivo' })
  readonly dientes_recuperables: number;

  @ApiProperty({ description: 'Dientes no recuperables del niño que asiste' })
  @IsNotEmpty({ message: 'Dientes no recuperables no puede estar vacio' })
  @IsInt({ message: 'Dientes no recuperables debe ser un número' })
  @IsPositive({ message: 'Dientes no recuperables debe ser un numero positivo' })
  readonly dientes_norecuperables: number;

  @ApiProperty({ description: 'Cepillo del niño que asiste a la consulta' })
  @IsNotEmpty({ message: ' Cepillo no puede estar vacio' })
  @IsBoolean({ message: 'Cepillo debe ser un boleano' })
  readonly cepillo: boolean;

  @ApiProperty({ description: 'Habitos del niño que asiste' })
  @IsNotEmpty({ message: 'Habitos no puede estar vacio' })
  @IsString({ message: 'Habitos debe ser un string' })
  @Length(1, 100, { message: 'Habitos debe tener entre 1 y 100 caracteres' })
  readonly habitos: string;

  @ApiProperty({ description: 'Estado situacional bucal del niño que asiste' })
  @IsNotEmpty({ message: 'Estado situacional bucal no puede estar vacio' })
  @IsString({ message: 'Estado situacional bucal debe ser un string' })
  @Length(1, 100, { message: 'Estado situacional bucal debe tener entre 1 y 100 caracteres' })
  readonly situacion_bucal: string;

  // CLASIFICACION SE CALCULA Y ES STRING este tambien incluir en entidad
}
