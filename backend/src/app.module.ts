import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { join } from 'path';

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
import { ProcesamientoModule } from './procesamiento/procesamiento.module';
import { TallerModule } from './taller/taller.module';
import { MarcoModule } from './marco/marco.module';
import { EspecialidadModule } from './especialidad/especialidad.module';
import { CategoriaModule } from './categoria/categoria.module';

@Module({
  imports: [
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'frontend', 'browser'), // Para el build de Angular
      },
      {
        rootPath: join(__dirname, '..', 'public'), // Para los archivos estáticos
        serveRoot: '/files', // Opcional: Define el prefijo de la URL
      },
    ),
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
    TallerModule,
    EspecialidadModule,
    MarcoModule,
    CategoriaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
