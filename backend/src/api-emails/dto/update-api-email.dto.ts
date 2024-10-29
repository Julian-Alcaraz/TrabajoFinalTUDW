import { PartialType } from '@nestjs/swagger';
import { CreateApiEmailDto } from './create-api-email.dto';

export class UpdateApiEmailDto extends PartialType(CreateApiEmailDto) {}
