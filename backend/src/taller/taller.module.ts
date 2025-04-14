import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TallerService } from './taller.service';
import { TallerController } from './taller.controller';
import { Taller } from './entities/taller.entity';
import { Especialidad } from '../especialidad/entities/especialidad.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Institucion } from '../institucion/entities/institucion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Taller, Especialidad, Curso, Institucion])],
  controllers: [TallerController],
  providers: [TallerService],
})
export class TallerModule {}
