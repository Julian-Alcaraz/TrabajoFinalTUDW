import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { RolModule } from './rol/rol.module';
import { MenuModule } from './menu/menu.module';
import { MenuRolModule } from './menu-rol/menu-rol.module';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioRolModule } from './usuario-rol/usuario-rol.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, RolModule, MenuModule, MenuRolModule, UsuarioModule, UsuarioRolModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
