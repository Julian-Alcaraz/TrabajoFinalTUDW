import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { RolModule } from './rol/rol.module';
import { MenuModule } from './menu/menu.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { ConsultaModule } from './consulta/consulta.module';
import { ChicoModule } from './chico/chico.module';
import { BarrioModule } from './barrio/barrio.module';
import { LocalidadModule } from './localidad/localidad.module';
import { CursoModule } from './curso/curso.module';
import { InstitucionModule } from './institucion/institucion.module';
import { ApiGeorefModule } from './api-georef/api-georef.module';
import { ApiSoapModule } from './api-soap/api-soap.module';
import { ApiEmailsModule } from './api-emails/api-emails.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: './config/.env' }), DatabaseModule, RolModule, MenuModule, UsuarioModule, AuthModule, ConsultaModule, ChicoModule, BarrioModule, LocalidadModule, CursoModule, InstitucionModule, ApiGeorefModule, ApiSoapModule, ApiEmailsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
