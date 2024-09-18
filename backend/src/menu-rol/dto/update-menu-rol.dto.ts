import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuRolDto } from './create-menu-rol.dto';
import { IsBoolean, IsOptional } from 'class-validator';
// NO SE USA ESTE ARCHIVO YA QUE NO HAY BORRADO LOGICO NI ACTUALIZACION DE IDS
export class UpdateMenuRolDto extends PartialType(CreateMenuRolDto) {
  @ApiProperty({ description: 'Indica si el menu esta deshabilitado' })
  @IsBoolean({ message: 'Deshabilitado debe ser un boolean' })
  @IsOptional()
  deshabilitado?: boolean;
}
