import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Barrio } from './entities/barrio.entity';
import { BarrioService } from './barrio.service';
import { BarrioController } from './barrio.controller';
import { Localidad } from 'src/localidad/entities/localidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barrio, Localidad])],
  controllers: [BarrioController],
  providers: [BarrioService],
})
export class BarrioModule {}
