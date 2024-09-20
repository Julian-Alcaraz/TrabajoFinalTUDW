import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

// Crear instancia de ConfigService para obtener las variables de configuración
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>('PG_HOST'),
  port: +configService.getOrThrow<number>('PG_PORT'),
  username: configService.getOrThrow<string>('PG_USERNAME'),
  password: configService.getOrThrow<string>('PG_PASSWORD'),
  database: configService.getOrThrow<string>('PG_DATABASE'),
  synchronize: configService.getOrThrow<string>('PG_SYNCHRONIZE') === 'true', // Convierte a booleano
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: ['src/**/*.entity.ts'], // Cambiar en producción
  migrations: [__dirname + '/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  migrationsTableName: 'migration_table',
});
