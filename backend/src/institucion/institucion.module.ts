import { Module } from '@nestjs/common';
import { InstitucionService } from './institucion.service';
import { InstitucionController } from './institucion.controller';
import { Institucion } from './entities/institucion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Institucion])],
  controllers: [InstitucionController],
  providers: [InstitucionService],
})
export class InstitucionModule {}
