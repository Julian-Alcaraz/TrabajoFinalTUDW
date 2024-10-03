import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { RolModule } from './rol/rol.module';
import { MenuModule } from './menu/menu.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { ConsultaModule } from './consulta/consulta.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: './config/.env' }), DatabaseModule, RolModule, MenuModule, UsuarioModule, AuthModule, ConsultaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
