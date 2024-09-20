import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUsuarioRolDto } from './dto/create-usuario-rol.dto';
import { UsuarioRol } from './entities/usuario-rol.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class UsuarioRolService {
  constructor(
    @InjectRepository(Rol) private readonly rolORM: Repository<Rol>,
    @InjectRepository(Usuario) private readonly usuarioORM: Repository<Usuario>,
    @InjectRepository(UsuarioRol) private readonly usuarioRolORM: Repository<UsuarioRol>,
  ) {}

  async create(createUsuarioRolDto: CreateUsuarioRolDto) {
    // Rol
    const idRol = createUsuarioRolDto.id_rol;
    const rol = await this.rolORM.findOneBy({ id: idRol });
    if (!rol) throw new NotFoundException(`Rol con id ${idRol} no encontrado`);
    // Usuario
    const idUsuario = createUsuarioRolDto.id_usuario;
    const usuario = await this.usuarioORM.findOneBy({ id: idUsuario });
    if (!usuario) throw new NotFoundException(`Usuario con id ${idUsuario} no encontrado`);
    // Crea un nuevo usuarioRol
    const nuevoUsuarioRol = this.usuarioRolORM.create({
      id_rol: rol.id,
      id_usuario: usuario.id,
    });
    // Guarda en BD
    return this.usuarioRolORM.save(nuevoUsuarioRol);
  }

  findAll() {
    return this.usuarioRolORM.find({ relations: ['usuario', 'rol'] });
  }

  async findOne(idUsuario: number, idRol: number) {
    const usuarioRol = await this.usuarioRolORM.findOne({ where: { id_usuario: idUsuario, id_rol: idRol }, relations: ['usuario', 'rol'] });
    if (!usuarioRol) throw new NotFoundException(`UsuarioRol con idUsuario ${idUsuario} e idRol ${idRol} no encontrado`);
    return usuarioRol;
  }

  async remove(idUsuario: number, idRol: number) {
    const usuarioRol = await this.usuarioRolORM.findOne({
      where: {
        id_usuario: idUsuario,
        id_rol: idRol,
      },
      relations: ['usuario', 'rol'],
    });
    if (!usuarioRol) throw new NotFoundException(`UsuarioRol con idUsuario ${idUsuario} e idRol ${idRol} no encontrado`);
    return this.usuarioRolORM.delete(usuarioRol);
  }

  async devolverRoles(idUsuario: number) {
    const roles = await this.usuarioRolORM.find({ where: { id_usuario: idUsuario }, relations: ['rol'] });
    return roles;
  }

  /*
  update(id: number, updateUsuarioRolDto: UpdateUsuarioRolDto) {
    return `This action updates a #${id} usuarioRol`;
  }
  */
}
