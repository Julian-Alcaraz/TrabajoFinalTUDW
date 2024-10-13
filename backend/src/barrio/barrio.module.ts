import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Barrio } from './entities/barrio.entity';
import { BarrioService } from './barrio.service';
import { BarrioController } from './barrio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Barrio])],
  controllers: [BarrioController],
  providers: [BarrioService],
})
export class BarrioModule {}
