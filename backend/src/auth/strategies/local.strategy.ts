import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'contrasenia' });
  }

  async validate(email: string, contrasenia: string) {
    const usuario = await this.authService.validarUsuario({ email, contrasenia });
    if (!usuario) throw new UnauthorizedException('Credenciales invalidas');
    return usuario;
  }
}
