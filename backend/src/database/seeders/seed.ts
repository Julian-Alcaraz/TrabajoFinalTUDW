import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { MainSeeder } from './main.seeder';
import { RolFactory } from '../factories/rol.factory';
import { UsuarioFactory } from '../factories/usuario.factory';
import { ChicoFactory } from '../factories/chico.factory';
import { MenuFactory } from '../factories/menu.factory';
import { ConsultaFactory } from '../factories/consulta.factory';
import { FonoaudiologiaFactory } from '../factories/fonoaudiologia.factory';
import { ClinicaFactory } from '../factories/clinica.factory';
import { OftalmologiaFactory } from '../factories/oftalmologia.factory';
import { OdontologiaFactory } from '../factories/odontologia.factory';

// Entidades
import { Menu } from '../../menu/entities/menu.entity';
import { Rol } from '../../rol/entities/rol.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Localidad } from '../../localidad/entities/localidad.entity';
import { Barrio } from '../../barrio/entities/barrio.entity';
import { Institucion } from '../../institucion/entities/institucion.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { Chico } from '../../chico/entities/chico.entity';
import { Consulta } from '../../consulta/entities/consulta.entity';
import { Clinica } from '../../consulta/entities/clinica.entity';
import { Oftalmologia } from '../../consulta/entities/oftalmologia.entity';
import { Odontologia } from '../../consulta/entities/odontologia.entity';
import { Fonoaudiologia } from '../../consulta/entities/fonoaudiologia.entity';

dotenv.config({ path: './config/.env' });

const configService = new ConfigService();

/*
console.log('====================== SEED.TS ======================');

console.log('TYPE_ORM_TYPE:', configService.getOrThrow<any>('TYPE_ORM_TYPE'));
console.log('TYPE_ORM_HOST:', configService.getOrThrow<string>('TYPE_ORM_HOST'));
console.log('TYPE_ORM_PORT:', configService.getOrThrow<number>('TYPE_ORM_PORT'));
console.log('TYPE_ORM_USERNAME:', configService.getOrThrow<string>('TYPE_ORM_USERNAME'));
console.log('TYPE_ORM_PASSWORD:', configService.getOrThrow<string>('TYPE_ORM_PASSWORD'));
console.log('TYPE_ORM_DATABASE:', configService.getOrThrow<string>('TYPE_ORM_DATABASE'));
console.log('TYPE_ORM_SYNCHRONIZE:', configService.getOrThrow<string>('TYPE_ORM_SYNCHRONIZE'));
console.log('TYPE_ORM_LOGGING:', configService.getOrThrow<string>('TYPE_ORM_LOGGING'));
console.log('TYPE_ORM_ENTITIES:', configService.getOrThrow<string>('TYPE_ORM_ENTITIES'));
console.log('TYPE_ORM_MIGRATIONS:', configService.getOrThrow<string>('TYPE_ORM_MIGRATIONS'));
console.log('TYPE_ORM_MIGRATIONS_TABLE_NAME:', configService.getOrThrow<string>('TYPE_ORM_MIGRATIONS_TABLE_NAME'));

console.log('====================== SEED.TS ======================');
*/

const options: DataSourceOptions & SeederOptions = {
  type: configService.getOrThrow<any>('TYPE_ORM_TYPE'),
  host: configService.getOrThrow<string>('TYPE_ORM_HOST'),
  port: +configService.getOrThrow<number>('TYPE_ORM_PORT'),
  username: configService.getOrThrow<string>('TYPE_ORM_USERNAME'),
  password: configService.getOrThrow<string>('TYPE_ORM_PASSWORD'),
  database: configService.getOrThrow<string>('TYPE_ORM_DATABASE'),
  entities: [Menu, Rol, Usuario, Localidad, Barrio, Institucion, Curso, Chico, Consulta, Clinica, Oftalmologia, Odontologia, Fonoaudiologia],
  factories: [RolFactory, UsuarioFactory, MenuFactory, ChicoFactory, ConsultaFactory, FonoaudiologiaFactory, ClinicaFactory, OftalmologiaFactory, OdontologiaFactory],
  seeds: [MainSeeder],
};

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize(true);
  await runSeeders(datasource);
  process.exit();
});
