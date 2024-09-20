import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthPayloadDto } from './dto/auth.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validarUsuario(authPayloadDto: AuthPayloadDto) {
    const emailIngresado = authPayloadDto.email;
    const contraseniaIngresada = authPayloadDto.contrasenia;
    // Validar que el email y contrasenia sean validos
    const usuarioEncontrado: Usuario = await this.usuarioService.buscarUsuarioPorEmail(emailIngresado);
    if (!usuarioEncontrado || contraseniaIngresada !== usuarioEncontrado.contrasenia) return null;
    /*
    const resultado = { token: this.jwtService.sign(usuarioEncontrado), usuario: delete usuarioEncontrado.contrasenia };
    console.log(resultado)
    return resultado;
    */
    const { contrasenia, ...usuario } = usuarioEncontrado; // Saca la contraseña antes de mandar el usuario
    return { token: this.jwtService.sign(usuario), usuario: usuario }; // Crea y retorna un token JWT usando las opciones de auth.module
  }
}
