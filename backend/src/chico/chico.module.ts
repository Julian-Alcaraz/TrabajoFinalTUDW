import { Module } from '@nestjs/common';
import { ChicoService } from './chico.service';
import { ChicoController } from './chico.controller';

@Module({
  controllers: [ChicoController],
  providers: [ChicoService],
})
export class ChicoModule {}
