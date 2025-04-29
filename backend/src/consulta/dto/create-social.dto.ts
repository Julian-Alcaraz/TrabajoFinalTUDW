import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSocialDto {
  @ApiProperty({ description: 'Demanda del niño que asiste' })
  @IsString({ message: 'La demanda debe ser un texto' })
  @IsNotEmpty({ message: 'La demanda no puede estar vacía' })
  readonly demanda: string;

  @ApiProperty({ description: 'Articulación relacionada con la consulta' })
  @IsString({ message: 'La articulación debe ser un texto' })
  readonly articulacion: string;

  @ApiProperty({ description: 'Objeto del informe asociado' })
  @IsString({ message: 'El objeto del informe debe ser un texto' })
  readonly objeto_informe: string;

  @ApiProperty({ description: 'Seguimiento realizado para el caso' })
  @IsString({ message: 'El seguimiento debe ser un texto' })
  readonly seguimiento: string;
}
