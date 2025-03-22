import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
        entities: [Menu, Rol, Usuario, Localidad, Barrio, Institucion, Curso, Chico, Consulta, Clinica, Oftalmologia, Odontologia, Fonoaudiologia],
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
