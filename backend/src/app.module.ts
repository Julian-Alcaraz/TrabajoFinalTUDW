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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProcesamientoModule } from './procesamiento/procesamiento.module';
import { ServiceModule } from './common/services/service.module';
import { TallerModule } from './taller/taller.module';
import { MarcoModule } from './marco/marco.module';
import { EspecialidadModule } from './especialidad/especialidad.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend', 'browser'), // Ruta a la carpeta con el build de Angular
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    DatabaseModule,
    RolModule,
    MenuModule,
    UsuarioModule,
    AuthModule,
    ConsultaModule,
    ChicoModule,
    BarrioModule,
    LocalidadModule,
    CursoModule,
    InstitucionModule,
    ProcesamientoModule,
    ServiceModule,
    TallerModule,
    EspecialidadModule,
    MarcoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
