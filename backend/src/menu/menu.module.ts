import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu } from './entities/menu.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { UsuarioRol } from 'src/usuario-rol/entities/usuario-rol.entity';
import { UsuarioRolService } from 'src/usuario-rol/usuario-rol.service';
import { MenuRolService } from 'src/menu-rol/menu-rol.service';
import { MenuRol } from 'src/menu-rol/entities/menu-rol.entity';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Rol, Usuario, UsuarioRol, MenuRol])],
  controllers: [MenuController],
  providers: [MenuService, UsuarioRolService, MenuRolService, UsuarioService],
})
export class MenuModule {}
