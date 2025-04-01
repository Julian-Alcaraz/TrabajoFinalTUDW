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
import { SecretService } from '../../common/services/secret.service';

dotenv.config();
const configService = new ConfigService();
const secretService = new SecretService(configService);

/*
console.log('====================== SEED.TS ======================');

console.log('DB_TYPE:', secretService.readSecret('DB_TYPE'));
console.log('DB_HOST:', secretService.readSecret('DB_HOST'));
console.log('DB_PORT:', secretService.readSecret('DB_PORT'));
console.log('DB_USERNAME:', secretService.readSecret('DB_DATABASE'));
console.log('DB_PASSWORD:', secretService.readSecret('DB_PASSWORD'));
console.log('DB_DATABASE:', secretService.readSecret('DB_DATABASE'));
console.log('DB_SYNCHRONIZE:', secretService.readSecret('DB_SYNCHRONIZE'));
console.log('DB_LOGGING:', secretService.readSecret('DB_LOGGING'));
console.log('DB_ENTITIES:', secretService.readSecret('DB_ENTITIES'));
console.log('DB_MIGRATIONS:', secretService.readSecret('DB_MIGRATIONS'));
console.log('DB_MIGRATIONS_TABLE_NAME:', secretService.readSecret('DB_MIGRATIONS_TABLE_NAME'));

console.log('====================== SEED.TS ======================');
*/
const options: DataSourceOptions & SeederOptions = {
  type: secretService.readSecret('DB_TYPE'),
  host: secretService.readSecret('DB_HOST'),
  port: +secretService.readSecret('DB_PORT'),
  database: secretService.readSecret('DB_DATABASE'),
  username: secretService.readSecret('DB_USERNAME'),
  password: secretService.readSecret('DB_PASSWORD'),
  entities: [Menu, Rol, Usuario, Localidad, Barrio, Institucion, Curso, Chico, Consulta, Clinica, Oftalmologia, Fonoaudiologia, Odontologia],
  factories: [RolFactory, UsuarioFactory, MenuFactory, ChicoFactory, ConsultaFactory, FonoaudiologiaFactory, ClinicaFactory, OftalmologiaFactory, OdontologiaFactory],
  seeds: [MainSeeder],
};

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize(true);
  await runSeeders(datasource);
  process.exit();
});
