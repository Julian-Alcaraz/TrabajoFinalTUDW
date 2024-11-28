import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthPayloadDto } from './dto/auth.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { compararContrasenias } from '../common/utils/bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validarUsuario(authPayloadDto: AuthPayloadDto) {
    const emailIngresado = authPayloadDto.email;
    const contraseniaIngresada = authPayloadDto.contrasenia;
    const usuario: Usuario = await this.usuarioService.buscarUsuarioPorEmail(emailIngresado);
    const contraseniaValida = compararContrasenias(contraseniaIngresada, usuario.contrasenia);
    if (contraseniaValida) {
      usuario.cambioContrasenia = String(usuario.dni) === contraseniaIngresada;
      delete usuario.contrasenia;
      return { token: this.jwtService.sign(usuario, { expiresIn: this.configService.getOrThrow('JWT_EXPIRES') }), usuario: usuario }; // Crea y retorna un token JWT usando las opciones de auth.module
    } else return null;
  }
}
