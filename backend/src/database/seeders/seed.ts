import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { RolFactory } from '../factories/rol.factory';
import { UsuarioFactory } from '../factories/usuario.factory';
import { MenuFactory } from '../factories/menu.factory';
import { MainSeeder } from './main.seeder';

dotenv.config({ path: './config/.env' });

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: configService.getOrThrow<any>('TYPE_ORM_TYPE'),
  host: configService.getOrThrow<string>('TYPE_ORM_HOST'),
  port: +configService.getOrThrow<number>('TYPE_ORM_PORT'),
  username: configService.getOrThrow<string>('TYPE_ORM_USERNAME'),
  password: configService.getOrThrow<string>('TYPE_ORM_PASSWORD'),
  database: configService.getOrThrow<string>('TYPE_ORM_DATABASE'),
  entities: [configService.getOrThrow<string>('TYPE_ORM_ENTITIES')],
  factories: [RolFactory, UsuarioFactory, MenuFactory],
  seeds: [MainSeeder],
};

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize(true);
  await runSeeders(datasource);
  process.exit();
});
