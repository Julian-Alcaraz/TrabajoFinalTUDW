import { Module } from '@nestjs/common';
import { ChicoService } from './chico.service';
import { ChicoController } from './chico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chico } from './entities/chico.entity';
import { Barrio } from 'src/barrio/entities/barrio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chico, Barrio])],
  controllers: [ChicoController],
  providers: [ChicoService],
})
export class ChicoModule {}
