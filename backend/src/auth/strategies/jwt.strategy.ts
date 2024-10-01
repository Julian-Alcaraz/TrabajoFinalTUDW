import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStragety extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // De donde saca el jwt token
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'), // Obtiene el secreto desde el archivo .env
    });
  }

  validate(payload: any) {
    // Payload que se genero en el service: .sign
    return payload;
  }
}
