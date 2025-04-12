import { Module } from '@nestjs/common';
import { MarcoService } from './marco.service';
import { MarcoController } from './marco.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marco } from './entities/marco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marco])],
  controllers: [MarcoController],
  providers: [MarcoService],
})
export class MarcoModule {}
