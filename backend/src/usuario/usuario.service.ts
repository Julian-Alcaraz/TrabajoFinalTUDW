import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { codificarContrasenia } from '../common/utils/bcrypt';

/*
  Podria no retornarse la contraseña cuando se crea un nuevo usuario
*/
@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario) private readonly usuarioORM: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolORM: Repository<Rol>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuarioEncontradoDni = await this.usuarioORM.findOneBy({ dni: createUsuarioDto.dni });
    if (usuarioEncontradoDni) throw new BadRequestException(`El usuario con dni ${createUsuarioDto.dni} ya esta cargado en el sistema`);
    const usuarioEncontradoEmail = await this.usuarioORM.findOneBy({ email: createUsuarioDto.email });
    if (usuarioEncontradoEmail) throw new BadRequestException(`El usuario con email ${createUsuarioDto.email} ya esta cargado en el sistema`);
    const contrasenia = codificarContrasenia(createUsuarioDto.contrasenia); // Hashea la contrasenia con bcrypt
    const nuevoUsuario = this.usuarioORM.create({ ...createUsuarioDto, contrasenia });
    // Roles
    if (createUsuarioDto.roles_ids) {
      const roles = await this.rolORM.findBy({ id: In(createUsuarioDto.roles_ids), deshabilitado: false });
      const rolesEncontradosIds = roles.map((rol) => rol.id);
      const rolesFaltantes = createUsuarioDto.roles_ids.filter((id) => !rolesEncontradosIds.includes(id));
      if (rolesFaltantes.length > 0) throw new NotFoundException(`Los roles con los siguientes ids no fueron encontrados: ${rolesFaltantes.join(', ')}`);
      nuevoUsuario.roles = roles;
    }
    return this.usuarioORM.save(nuevoUsuario);
  }

  async findAll() {
    return this.usuarioORM.find({ relations: ['roles'] });
    // { where: { deshabilitado: false } }
  }

  async findOne(id: number) {
    const usuario = await this.usuarioORM.findOne({ where: { id, deshabilitado: false }, relations: ['roles'] });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    if (usuario.roles) usuario.roles = usuario.roles.filter((rol) => !rol.deshabilitado);
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
    if (cambios.contrasenia) {
      const contrasenia = codificarContrasenia(cambios.contrasenia); // Hashea la contrasenia con bcrypt
      cambios.contrasenia = contrasenia;
    }
    if (cambios.email) {
      const usuarioEncontradoEmail = await this.usuarioORM.findOneBy({ email: cambios.email });
      if (usuarioEncontradoEmail) throw new BadRequestException(`El email ${cambios.email} ya esta cargado en el sistema`);
    }
    this.usuarioORM.merge(usuario, cambios);
    return this.usuarioORM.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.usuarioORM.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    else if (usuario.deshabilitado) throw new BadRequestException(`El usuario con id ${id} ya esta deshabilitado`);
    usuario.deshabilitado = true;
    return this.usuarioORM.save(usuario);
  }

  async eliminarRolDeUsuario(idUsuario: number, idRol: number) {
    const usuario = await this.usuarioORM.findOne({ where: { id: idUsuario, deshabilitado: false }, relations: ['roles'] });
    if (!usuario) throw new NotFoundException(`Usuario con id ${idUsuario} no encontrado`);
    const rol = usuario.roles.find((rol) => rol.id === idRol);
    if (!rol) throw new NotFoundException(`Rol con id ${idRol} no esta asignado al usuario ${idUsuario}`);
    usuario.roles = usuario.roles.filter((item) => item.id !== idRol);
    if (usuario.roles.length === 0) throw new BadRequestException(`Un usuario no puede quedarse sin roles`);
    return this.usuarioORM.save(usuario);
  }

  async agregarRolDeUsuario(idUsuario: number, idRol: number) {
    const usuario = await this.usuarioORM.findOne({ where: { id: idUsuario, deshabilitado: false }, relations: ['roles'] });
    if (!usuario) throw new NotFoundException(`Usuario con id ${idUsuario} no encontrado`);
    const rol = await this.rolORM.findOne({ where: { id: idRol, deshabilitado: false } });
    if (!rol) throw new NotFoundException(`Rol con id ${idRol} no encontrado`);
    if (usuario.roles.find((item) => item.id === idRol)) throw new BadRequestException(`El usuario con id ${idUsuario} ya tiene al rol con id ${idRol}`);
    usuario.roles.push(rol);
    return this.usuarioORM.save(usuario);
  }

  async buscarUsuarioPorEmail(email: string) {
    const usuario = await this.usuarioORM.findOne({ where: { deshabilitado: false, email: email }, relations: ['roles'] });
    if (!usuario) throw new NotFoundException(`Usuario no encontrado.`);
    const colIdsRoles = usuario.roles.map((rol) => rol.id);
    delete usuario.roles;
    const usuarioConRolesIds = {
      ...usuario,
      roles_ids: colIdsRoles,
    };
    return usuarioConRolesIds;
  }

  async menusDeUsuario(id: number) {
    // Busco el usuario
    const usuario = await this.usuarioORM.findOne({ where: { deshabilitado: false, id: id }, relations: ['roles'] });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    const rolesUsuario = usuario.roles;
    if (!rolesUsuario) throw new NotFoundException(`Usuario con id ${id} no tiene roles`); // No deberia pasar esto nunca
    let colMenus = [];
    const colMenusSet = new Set();
    for (const rol of rolesUsuario) {
      const objRol = await this.rolORM.findOne({ where: { id: rol.id }, relations: ['menus', 'menus.sub_menus', 'menus.menu_padre'] });
      const menusRol = objRol.menus;
      const menusNoFalsos = menusRol.filter((menu) => {
        if (!menu.deshabilitado) {
          const submenusNoFalsos = menu.sub_menus.filter((subMenu) => {
            if (!subMenu.deshabilitado) {
              return subMenu;
            }
          });
          menu.sub_menus = submenusNoFalsos;
          return menu;
        }
      });
      for (const menu of menusNoFalsos) {
        if (!menu.menu_padre) {
          colMenusSet.add(JSON.stringify(menu));
        }
      }
    }
    colMenus = Array.from(colMenusSet).map((menuString: string) => JSON.parse(menuString));
    // Ordena los padres por "orden"
    colMenus.sort((a, b) => a.orden - b.orden);
    return colMenus;
  }

  async usuariosProfesionales() {
    const usuariosProfesionales = [];
    const usuarios = await this.usuarioORM.find({ where: { deshabilitado: false }, relations: ['roles'] });
    const rolProfesional = await this.rolORM.findOne({ where: { nombre: 'Profesional', deshabilitado: false } });
    if (!rolProfesional) throw new NotFoundException(`Rol "Profesional" no encontrado`);
    for (const usuario of usuarios) {
      const rolesDeUsuario = usuario.roles;
      if (rolesDeUsuario.map((item) => item.nombre === 'Profesional').includes(true)) {
        delete usuario.contrasenia;
        usuariosProfesionales.push(usuario);
      }
    }
    return usuariosProfesionales;
  }
}
