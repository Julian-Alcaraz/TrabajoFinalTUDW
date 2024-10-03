import { PartialType } from '@nestjs/swagger';
import { CreateChicoDto } from './create-chico.dto';

export class UpdateChicoDto extends PartialType(CreateChicoDto) {}
