import { PartialType } from '@nestjs/swagger';
import { CreateBarrioDto } from './create-barrio.dto';

export class UpdateBarrioDto extends PartialType(CreateBarrioDto) {}
