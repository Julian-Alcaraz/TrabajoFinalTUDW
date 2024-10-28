import { PartialType } from '@nestjs/swagger';
import { CreateApiGeorefDto } from './create-api-georef.dto';

export class UpdateApiGeorefDto extends PartialType(CreateApiGeorefDto) {}
