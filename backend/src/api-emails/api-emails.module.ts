import { Module } from '@nestjs/common';
import { ApiEmailsService } from './api-emails.service';
import { ApiEmailsController } from './api-emails.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ApiEmailsController],
  providers: [ApiEmailsService],
})
export class ApiEmailsModule {}
