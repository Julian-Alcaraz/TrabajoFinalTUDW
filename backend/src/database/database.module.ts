import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('PG_HOST'),
        port: configService.getOrThrow('PG_PORT'),
        database: configService.getOrThrow('PG_DATABASE'),
        username: configService.getOrThrow('PG_USERNAME'),
        password: configService.getOrThrow('PG_PASSWORD'),
        synchronize: configService.getOrThrow('PG_SYNCHRONIZE'),
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
