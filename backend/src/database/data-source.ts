import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: +process.env.PG_PORT,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: process.env.PG_SYNCHRONIZE === 'true', // Convierte a boolean
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: ['src/**/*.entity.ts'], // CAMBIAR EN PRODUCION!!!!!!!!!!!
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrationsTableName: 'migration_table',
});
