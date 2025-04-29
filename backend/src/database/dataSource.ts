import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Entidades
import { SecretService } from '../common/services/secret.service';

dotenv.config();
const configService = new ConfigService();
const secretService = new SecretService(configService);

/*
/*
console.log('====================== DATASOURCE.TS ======================');

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

console.log('====================== DATASOURCE.TS ======================');
*/
export default new DataSource({
  type: 'postgres',
  host: secretService.readSecret('DB_HOST'),
  port: +secretService.readSecret('DB_PORT'),
  database: secretService.readSecret('DB_DATABASE'),
  username: secretService.readSecret('DB_USERNAME'),
  password: secretService.readSecret('DB_PASSWORD'),
  synchronize: secretService.readSecret('DB_SYNCHRONIZE') === 'true',
  logging: secretService.readSecret('DB_LOGGING') === 'true',
  entities: [secretService.readSecret('DB_ENTITIES')],
  migrations: [secretService.readSecret('DB_MIGRATIONS')],
  migrationsTableName: secretService.readSecret('DB_MIGRATIONS_TABLE_NAME'),
  dropSchema: false,
  // logger: 'file',
  subscribers: ['src/subscriber/**/*.ts'],
});
