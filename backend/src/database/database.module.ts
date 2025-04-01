import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Global } from '@nestjs/common';

// Entidades
import { SecretService } from '../common/services/secret.service';

@Global()
@Module({
  providers: [SecretService],
  exports: [SecretService],
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (secretService: SecretService) => ({
        // 'postgres' | 'mysql'
        type: secretService.readSecret('DB_TYPE'),
        host: secretService.readSecret('DB_HOST'),
        port: +secretService.readSecret('DB_PORT'),
        database: secretService.readSecret('DB_DATABASE'),
        username: secretService.readSecret('DB_USERNAME'),
        password: secretService.readSecret('DB_PASSWORD'),
        synchronize: secretService.readSecret('DB_SYNCHRONIZE') === 'true', // Convierte a booleano
        entities: [secretService.readSecret('DB_ENTITIES')],
        autoLoadEntities: true,
        //seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        //factories: [__dirname + '/factories/**/*{.ts,.js}'],
        //cli: {
        //  migrationsDir: __dirname + '/migrations/',
        //},
      }),
      inject: [SecretService],
    }),
  ],
})
export class DatabaseModule {}
