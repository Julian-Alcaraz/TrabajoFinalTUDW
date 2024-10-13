import { Module } from '@nestjs/common';
import { LocalidadService } from './localidad.service';
import { LocalidadController } from './localidad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localidad } from './entities/localidad.entity';
import { Barrio } from 'src/barrio/entities/barrio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Localidad, Barrio])],
  controllers: [LocalidadController],
  providers: [LocalidadService],
})
export class LocalidadModule {}
