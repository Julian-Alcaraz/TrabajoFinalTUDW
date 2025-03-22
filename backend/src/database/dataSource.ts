import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Entidades
import { Menu } from '../menu/entities/menu.entity';
import { Rol } from '../rol/entities/rol.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Localidad } from '../localidad/entities/localidad.entity';
import { Barrio } from '../barrio/entities/barrio.entity';
import { Institucion } from '../institucion/entities/institucion.entity';
import { Curso } from '../curso/entities/curso.entity';
import { Chico } from '../chico/entities/chico.entity';
import { Consulta } from '../consulta/entities/consulta.entity';
import { Clinica } from '../consulta/entities/clinica.entity';
import { Oftalmologia } from '../consulta/entities/oftalmologia.entity';
import { Odontologia } from '../consulta/entities/odontologia.entity';
import { Fonoaudiologia } from '../consulta/entities/fonoaudiologia.entity';

// Cargar variables de entorno
dotenv.config({ path: './config/.env' });

const configService = new ConfigService();

/*
console.log('====================== DATASOURCE.TS ======================');
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
console.log('====================== DATASOURCE.TS ======================');
*/

export default new DataSource({
  type: configService.getOrThrow<any>('TYPE_ORM_TYPE'),
  host: configService.getOrThrow<string>('TYPE_ORM_HOST'),
  port: +configService.getOrThrow<number>('TYPE_ORM_PORT'),
  username: configService.getOrThrow<string>('TYPE_ORM_USERNAME'),
  password: configService.getOrThrow<string>('TYPE_ORM_PASSWORD'),
  database: configService.getOrThrow<string>('TYPE_ORM_DATABASE'),
  synchronize: configService.getOrThrow<string>('TYPE_ORM_SYNCHRONIZE') === 'true',
  logging: configService.getOrThrow<string>('TYPE_ORM_LOGGING') === 'true',
  entities: [Menu, Rol, Usuario, Localidad, Barrio, Institucion, Curso, Chico, Consulta, Clinica, Oftalmologia, Odontologia, Fonoaudiologia],
  migrations: [configService.getOrThrow<string>('TYPE_ORM_MIGRATIONS')],
  migrationsTableName: configService.getOrThrow<string>('TYPE_ORM_MIGRATIONS_TABLE_NAME'),
  dropSchema: false,
  // logger: 'file',
  subscribers: ['src/subscriber/**/*.ts'],
});
