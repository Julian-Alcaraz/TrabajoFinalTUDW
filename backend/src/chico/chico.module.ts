import { Module } from '@nestjs/common';
import { ChicoService } from './chico.service';
import { ChicoController } from './chico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chico } from './entities/chico.entity';
import { Barrio } from 'src/barrio/entities/barrio.entity';
import { Consulta } from 'src/consulta/entities/consulta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chico, Barrio, Consulta])],
  controllers: [ChicoController],
  providers: [ChicoService],
})
export class ChicoModule {}
