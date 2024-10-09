import { Module } from '@nestjs/common';
import { BarrioService } from './barrio.service';
import { BarrioController } from './barrio.controller';

@Module({
  controllers: [BarrioController],
  providers: [BarrioService],
})
export class BarrioModule {}
