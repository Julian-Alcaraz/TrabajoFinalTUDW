import { Module } from '@nestjs/common';
import { MenuRolService } from './menu-rol.service';
import { MenuRolController } from './menu-rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuRol } from './entities/menu-rol.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Rol } from 'src/rol/entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuRol, Rol, Menu])],
  controllers: [MenuRolController],
  providers: [MenuRolService],
})
export class MenuRolModule {}
