import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('PG_HOST'),
        port: +configService.getOrThrow<number>('PG_PORT'),
        database: configService.getOrThrow<string>('PG_DATABASE'),
        username: configService.getOrThrow<string>('PG_USERNAME'),
        password: configService.getOrThrow<string>('PG_PASSWORD'),
        synchronize: configService.getOrThrow<string>('PG_SYNCHRONIZE') === 'true', // Convierte a booleano
        autoLoadEntities: true,
        entities: ['src/**/*.entity.ts'], // CAMBIAR EN PRODUCION!!!!!!!!!!!
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations/',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
