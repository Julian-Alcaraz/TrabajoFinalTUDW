import { PartialType } from '@nestjs/swagger';
import { CreateProcesamientoDto } from './create-procesamiento.dto';

export class UpdateProcesamientoDto extends PartialType(CreateProcesamientoDto) {}
