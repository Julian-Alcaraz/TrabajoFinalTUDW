import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: './config/.env' });

const configService = new ConfigService();
// Imprimir valores de configuración
/*
console.log('TYPE_ORM_TYPE', configService.getOrThrow<any>('TYPE_ORM_TYPE'));
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
  entities: [configService.getOrThrow<string>('TYPE_ORM_ENTITIES')],
  migrations: [configService.getOrThrow<string>('TYPE_ORM_MIGRATIONS')],
  migrationsTableName: configService.getOrThrow<string>('TYPE_ORM_MIGRATIONS_TABLE_NAME'),
  dropSchema: false,
  // logger: 'file',
  subscribers: ['src/subscriber/**/*.ts'],
});
