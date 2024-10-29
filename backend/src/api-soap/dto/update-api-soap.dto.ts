import { PartialType } from '@nestjs/swagger';
import { CreateApiSoapDto } from './create-api-soap.dto';

export class UpdateApiSoapDto extends PartialType(CreateApiSoapDto) {}
