import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthPayloadDto } from './dto/auth.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { compararContrasenias } from '../common/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(authPayloadDto: AuthPayloadDto) {
    const emailIngresado = authPayloadDto.email;
    const contraseniaIngresada = authPayloadDto.contrasenia;
    const usuario: Usuario | null = await this.usuarioService.buscarUsuarioPorEmail(emailIngresado);
    if (!usuario) return null; // Aca podria agregarse un mensaje diciendo que no se encontro el usuario 
    const contraseniaValida = compararContrasenias(contraseniaIngresada, usuario.contrasenia);
    if (contraseniaValida) {
      delete usuario.contrasenia;
      return { token: this.jwtService.sign(usuario), usuario: usuario }; // Crea y retorna un token JWT usando las opciones de auth.module
    } else return null;
  }
}
