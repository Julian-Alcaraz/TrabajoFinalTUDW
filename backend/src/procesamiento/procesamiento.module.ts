import { Module } from '@nestjs/common';
import { ProcesamientoService } from './procesamiento.service';
import { ProcesamientoController } from './procesamiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from 'src/consulta/entities/consulta.entity';
import { Clinica } from 'src/consulta/entities/clinica.entity';
import { Oftalmologia } from 'src/consulta/entities/oftalmologia.entity';
import { Odontologia } from 'src/consulta/entities/odontologia.entity';
import { Fonoaudiologia } from 'src/consulta/entities/fonoaudiologia.entity';
import { Chico } from 'src/chico/entities/chico.entity';
import { Institucion } from 'src/institucion/entities/institucion.entity';
import { Curso } from 'src/curso/entities/curso.entity';
import { ExcelService } from 'src/common/services/excel.service';
import { Barrio } from 'src/barrio/entities/barrio.entity';
import { ExportService } from './export.service';
import { ConsultaService } from 'src/consulta/consulta.service';
import { Prevencion } from 'src/consulta/entities/prevencion.entity';
import { Social } from 'src/consulta/entities/social.entity';
import { ArchivoService } from 'src/common/services/archivo.service';
import { Taller } from 'src/taller/entities/taller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Clinica, Oftalmologia, Odontologia, Fonoaudiologia, Chico, Institucion, Curso, Barrio, Prevencion, Social, Taller])],
  controllers: [ProcesamientoController],
  providers: [ProcesamientoService, ExcelService, ExportService, ConsultaService, ArchivoService],
  exports: [ProcesamientoService],
})
export class ProcesamientoModule {}
