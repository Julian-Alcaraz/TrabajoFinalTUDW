import { PartialType } from '@nestjs/swagger';
import { CreateFonoaudiologiaDto } from './create-fonoaudiologia.dto';

export class UpdateFonoaudiologiaDto extends PartialType(CreateFonoaudiologiaDto) {}
