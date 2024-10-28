import { PartialType } from '@nestjs/swagger';
import { CreateOftalmologiaDto } from './create-oftalmologia.dto';

export class UpdateOftalmologiaDto extends PartialType(CreateOftalmologiaDto) {}
