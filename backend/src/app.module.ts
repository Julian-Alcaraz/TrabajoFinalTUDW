import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { RolModule } from './rol/rol.module';
import { MenuModule } from './menu/menu.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: './config/.env' }), DatabaseModule, RolModule, MenuModule, UsuarioModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
