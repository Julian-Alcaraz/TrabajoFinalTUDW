import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiGeorefService } from './api-georef.service';
import { ApiGeorefController } from './api-georef.controller';

@Module({
  imports: [HttpModule],
  controllers: [ApiGeorefController],
  providers: [ApiGeorefService],
})
export class ApiGeorefModule {}
