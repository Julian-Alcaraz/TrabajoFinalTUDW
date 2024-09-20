import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { codificarContrasenia } from 'src/utils/bcrypt';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(Usuario) private readonly usuarioORM: Repository<Usuario>) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioEncontradoDni = await this.usuarioORM.findOneBy({ dni: createUsuarioDto.dni });
    if (usuarioEncontradoDni) throw new BadRequestException(`El usuario con dni ${createUsuarioDto.dni} ya esta cargado en el sistema`);
    const usuarioEncontradoEmail = await this.usuarioORM.findOneBy({ email: createUsuarioDto.email });
    if (usuarioEncontradoEmail) throw new BadRequestException(`El usuario con email ${createUsuarioDto.email} ya esta cargado en el sistema`);
    const contrasenia = codificarContrasenia(createUsuarioDto.contrasenia); // Hashea la contrasenia con bcrypt
    const nuevoUsuario = this.usuarioORM.create({ ...createUsuarioDto, contrasenia });
    return this.usuarioORM.save(nuevoUsuario);
  }

  findAll() {
    return this.usuarioORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return usuario;
  }

  async update(id: number, cambios: UpdateUsuarioDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const usuario = await this.usuarioORM.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    if (cambios.dni) {
      const usuarioEncontradoDni = await this.usuarioORM.findOneBy({ dni: cambios.dni });
      if (usuarioEncontradoDni) throw new BadRequestException(`El dni ${cambios.dni} ya esta cargado en el sistema`);
    }
    if (cambios.email) {
      const usuarioEncontradoEmail = await this.usuarioORM.findOneBy({ email: cambios.email });
      if (usuarioEncontradoEmail) throw new BadRequestException(`El email ${cambios.email} ya esta cargado en el sistema`);
    }
    this.usuarioORM.merge(usuario, cambios);
    return this.usuarioORM.save(usuario);
  }

  async borradoLogico(id: number) {
    const usuario = await this.usuarioORM.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    else if (usuario.deshabilitado) throw new BadRequestException(`El usuario con id ${id} ya esta deshabilitado`);
    usuario.deshabilitado = true;
    return this.usuarioORM.save(usuario);
  }

  async buscarUsuarioPorEmail(email: string) {
    const usuario = await this.usuarioORM.findOne({ where: { deshabilitado: false, email: email } });
    return usuario;
  }

  /*
  async remove(id: number) {
    const usuario = await this.usuarioORM.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    this.usuarioORM.delete(id);
  }
  */
}
