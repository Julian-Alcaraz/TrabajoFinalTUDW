import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('TYPE_ORM_HOST'),
        port: +configService.getOrThrow<number>('TYPE_ORM_PORT'),
        database: configService.getOrThrow<string>('TYPE_ORM_DATABASE'),
        username: configService.getOrThrow<string>('TYPE_ORM_USERNAME'),
        password: configService.getOrThrow<string>('TYPE_ORM_PASSWORD'),
        synchronize: configService.getOrThrow<string>('TYPE_ORM_SYNCHRONIZE') === 'true', // Convierte a booleano
        entities: [configService.getOrThrow('TYPE_ORM_ENTITIES')], // CAMBIAR EN PRODUCION!!!!!!!!!!!
        autoLoadEntities: true,
        //seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        //factories: [__dirname + '/factories/**/*{.ts,.js}'],
        //cli: {
        //  migrationsDir: __dirname + '/migrations/',
        //},
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
