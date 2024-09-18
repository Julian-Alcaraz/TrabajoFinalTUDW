import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioRolService } from './usuario-rol.service';
import { UsuarioRolController } from './usuario-rol.controller';
import { UsuarioRol } from './entities/usuario-rol.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioRol, Rol, Usuario])],
  controllers: [UsuarioRolController],
  providers: [UsuarioRolService],
})
export class UsuarioRolModule {}
