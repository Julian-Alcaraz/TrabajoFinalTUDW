import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { Clinica } from './entities/clinica.entity';
import { Oftalmologia } from './entities/oftalmologia.entity';
import { Odontologia } from './entities/odontologia.entity';
import { Fonoaudiologia } from './entities/fonoaudiologia.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { Chico } from 'src/chico/entities/chico.entity';
import { Curso } from 'src/curso/entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Clinica, Oftalmologia, Odontologia, Fonoaudiologia, Chico, Institucion, Curso])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule {}
