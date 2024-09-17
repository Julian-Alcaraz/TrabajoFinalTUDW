import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsuarioRolDto } from './dto/create-usuario-rol.dto';
import { UpdateUsuarioRolDto } from './dto/update-usuario-rol.dto';
import { UsuarioRol } from './entities/usuario-rol.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class UsuarioRolService {
  constructor(
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(UsuarioRol) private usuarioRolRepo: Repository<UsuarioRol>,
  ) {}

  async create(createUsuarioRolDto: CreateUsuarioRolDto) {
    // Rol
    const idRol = createUsuarioRolDto.id_rol;
    const rol = await this.rolRepo.findOneBy({ id: idRol });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${idRol} no encontrado`);
    }
    // Usuario
    const idUsuario = createUsuarioRolDto.id_usuario;
    const usuario = await this.usuarioRepo.findOneBy({ id: idUsuario });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${idUsuario} no encontrado`);
    }
    // Crea un nuevo usuarioRol
    const nuevoUsuarioRol = this.usuarioRolRepo.create({
      id_rol: rol.id,
      id_usuario: usuario.id,
    });
    // Guarda en BD
    return this.usuarioRolRepo.save(nuevoUsuarioRol);
  }

  findAll() {
    return this.usuarioRolRepo.find({ relations: ['usuario', 'rol'] });
  }

  async findOne(idUsuario: number, idRol: number) {
    const usuarioRol = await this.usuarioRolRepo.findOne({
      where: {
        id_usuario: idUsuario,
        id_rol: idRol,
      },
      relations: ['usuario', 'rol'],
    });
    if (!usuarioRol) {
      throw new NotFoundException(`UsuarioRol con idUsuario ${idUsuario} e idRol ${idRol} no encontrado`);
    }
    return usuarioRol;
  }

  /*
  update(id: number, updateUsuarioRolDto: UpdateUsuarioRolDto) {
    return `This action updates a #${id} usuarioRol`;
  }
  */

  async remove(idUsuario: number, idRol: number) {
    const usuarioRol = await this.usuarioRolRepo.findOne({
      where: {
        id_usuario: idUsuario,
        id_rol: idRol,
      },
      relations: ['usuario', 'rol'],
    });
    if (!usuarioRol) {
      throw new NotFoundException(`UsuarioRol con idUsuario ${idUsuario} e idRol ${idRol} no encontrado`);
    }
    this.usuarioRolRepo.delete(usuarioRol);
  }
}