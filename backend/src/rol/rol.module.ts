import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { Rol } from './entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])], // Le dice a typeOrm que encarge de la entidad rol
  controllers: [RolController],
  providers: [RolService],
})
export class RolModule {}
