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
  constructor(@InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioEncontrado = await this.usuarioRepo.findOneBy({ dni: createUsuarioDto.dni });
    if (usuarioEncontrado) {
      throw new BadRequestException(`El usuario con dni ${createUsuarioDto.dni} ya está cargado en el sistema`);
    }
    const nuevoUsuario = this.usuarioRepo.create(createUsuarioDto);
    return this.usuarioRepo.save(nuevoUsuario);
  }

  // AGREGAR RELACIONES DESPUES
  findAll() {
    return this.usuarioRepo.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async update(id: number, cambios: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    if (cambios.dni) {
      const usuarioEncontrado = await this.usuarioRepo.findOneBy({ dni: cambios.dni });
      if (usuarioEncontrado) {
        throw new BadRequestException(`El dni ${cambios.dni} ya esta cargado en el sistema`);
      }
    }
    this.usuarioRepo.merge(usuario, cambios);
    return this.usuarioRepo.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    this.usuarioRepo.delete(id);
  }

  async borradoLogico(id: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    } else if (usuario.deshabilitado) {
      throw new BadRequestException(`El usuario con id ${id} ya esta deshabilitado`);
    }
    usuario.deshabilitado = true;
    return this.usuarioRepo.save(usuario);
  }
}
