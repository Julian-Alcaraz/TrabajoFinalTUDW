import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStragety } from './strategies/jwt.strategy';
import { Rol } from 'src/rol/entities/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol]), // No se porque pero necesita el ROL aca
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'), // Valor para encriptar el payload para luego generar un token jwt
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES') }, // En cuanto tiempo expira el token jwt
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsuarioService, LocalStrategy, JwtStragety],
})
export class AuthModule {}
