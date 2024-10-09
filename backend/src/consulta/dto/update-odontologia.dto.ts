import { PartialType } from '@nestjs/swagger';
import { CreateOdontologiaDto } from './create-odontologia.dto';

export class UpdateClinicaDto extends PartialType(CreateOdontologiaDto) {}
