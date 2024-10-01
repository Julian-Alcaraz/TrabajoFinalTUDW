import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Menu } from './entities/menu.entity';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Rol } from 'src/rol/entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Rol])],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
