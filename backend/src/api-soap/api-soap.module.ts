import { Module } from '@nestjs/common';
import { ApiSoapService } from './api-soap.service';
import { ApiSoapController } from './api-soap.controller';

@Module({
  controllers: [ApiSoapController],
  providers: [ApiSoapService],
})
export class ApiSoapModule {}
