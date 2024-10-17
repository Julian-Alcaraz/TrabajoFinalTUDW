import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { ClinicaGeneral } from './entities/clinica.entity';
import { Oftalmologia } from './entities/oftalmologia.entity';
import { Odontologia } from './entities/odontologia.entity';
import { Fonoaudiologia } from './entities/fonoaudiologia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, ClinicaGeneral, Oftalmologia, Odontologia, Fonoaudiologia])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule {}
