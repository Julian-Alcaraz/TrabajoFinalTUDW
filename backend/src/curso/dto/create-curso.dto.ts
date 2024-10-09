import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCursoDto {
  @ApiProperty({ description: 'Año del curso.' })
  @IsNotEmpty({ message: 'El año no puede estar vacio' })
  @IsInt({ message: 'El año debe ser un number' })
  @IsPositive({ message: 'El id de la localidad debe ser un numero positivo' })
  readonly anio: number;
}
