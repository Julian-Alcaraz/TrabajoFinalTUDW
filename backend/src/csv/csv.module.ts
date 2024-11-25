import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';

import { ConsultaModule } from '../consulta/consulta.module';

@Module({
  imports: [ConsultaModule],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}
