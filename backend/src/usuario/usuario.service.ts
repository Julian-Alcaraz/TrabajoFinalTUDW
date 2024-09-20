import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

/*
  Los metodos findOne, update y remove no verifican si el usuario esta en deshabilitado = true
*/
@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private readonly usuarioORM: Repository<Usuario>) {}

  /*
    ACA FALTA VALIDAR QUE EL EMAIL NO COINCIDA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  */
  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioEncontrado = await this.usuarioORM.findOneBy({ dni: createUsuarioDto.dni });
    if (usuarioEncontrado) {
      throw new BadRequestException(`El usuario con dni ${createUsuarioDto.dni} ya está cargado en el sistema`);
    }
    const nuevoUsuario = this.usuarioORM.create(createUsuarioDto);
    return this.usuarioORM.save(nuevoUsuario);
  }

  findAll() {
    return this.usuarioORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  /*
    ACA FALTA VALIDAR SI QUIERE CAMBIAR EL EMAIL QUE EL EMAIL NO ESTE EN USO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  */
  async update(id: number, cambios: UpdateUsuarioDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const usuario = await this.usuarioORM.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    if (cambios.dni) {
      const usuarioEncontrado = await this.usuarioORM.findOneBy({ dni: cambios.dni });
      if (usuarioEncontrado) {
        throw new BadRequestException(`El dni ${cambios.dni} ya esta cargado en el sistema`);
      }
    }
    this.usuarioORM.merge(usuario, cambios);
    return this.usuarioORM.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.usuarioORM.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    this.usuarioORM.delete(id);
  }

  /**
   * Hace un borrado logico de un item
   */
  async borradoLogico(id: number) {
    const usuario = await this.usuarioORM.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    } else if (usuario.deshabilitado) {
      throw new BadRequestException(`El usuario con id ${id} ya esta deshabilitado`);
    }
    usuario.deshabilitado = true;
    return this.usuarioORM.save(usuario);
  }

  /**
   * Busca un usuario por su email
   */
  async buscarUsuarioPorEmail(email: string) {
    const usuario = await this.usuarioORM.findOne({ where: { deshabilitado: false, email: email } });
    return usuario;
  }
}
