import { Module } from '@nestjs/common';
import { ApiSoapService } from './api-soap.service';
import { ApiSoapController } from './api-soap.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ApiSoapController],
  providers: [ApiSoapService],
})
export class ApiSoapModule {}
