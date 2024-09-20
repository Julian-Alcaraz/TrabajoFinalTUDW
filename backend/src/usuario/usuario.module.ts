import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { UsuarioRol } from 'src/usuario-rol/entities/usuario-rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, UsuarioRol])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
