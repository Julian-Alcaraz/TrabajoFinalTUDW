import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { Rol } from 'src/rol/entities/rol.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuORM: Repository<Menu>,
    @InjectRepository(Rol) private readonly rolORM: Repository<Rol> /* Podria estar en servicio */,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const idMenuPadre = createMenuDto.menu_padre ? createMenuDto.menu_padre : null;
    let menu_padre: Menu | null = null;
    // Menu padre
    if (idMenuPadre !== null) {
      menu_padre = await this.menuORM.findOneBy({ id: idMenuPadre });
      if (!menu_padre) throw new NotFoundException(`Menu con id ${idMenuPadre} no encontrado`);
    }
    const nuevoMenu = this.menuORM.create({
      ...createMenuDto,
      menu_padre: menu_padre ? menu_padre : null,
    });
    // Roles
    if (createMenuDto.roles_ids) {
      const roles = await this.rolORM.findBy({ id: In(createMenuDto.roles_ids), deshabilitado: false });
      const rolesEncontradosIds = roles.map((rol) => rol.id);
      const rolesFaltantes = createMenuDto.roles_ids.filter((id) => !rolesEncontradosIds.includes(id));
      if (rolesFaltantes.length > 0) throw new NotFoundException(`Los roles con los siguientes ids no fueron encontrados: ${rolesFaltantes.join(', ')}`);
      nuevoMenu.roles = roles;
    }
    // Guarda en la base de datos
    return this.menuORM.save(nuevoMenu);
  }

  async findAll() {
    const menus = await this.menuORM.find({ where: { deshabilitado: false }, relations: ['sub_menus'] });
    const menusFiltrados = menus.map((menu) => {
      return {
        ...menu,
        sub_menus: menu.sub_menus.filter((subMenu) => !subMenu.deshabilitado),
      };
    });
    return menusFiltrados;
  }

  async findOne(id: number) {
    const menu = await this.menuORM.findOne({ where: { id, deshabilitado: false }, relations: ['sub_menus', 'roles'] });
    if (!menu) throw new NotFoundException(`Menu con id ${id} no encontrado`);
    if (menu.roles) menu.roles = menu.roles.filter((rol) => !rol.deshabilitado);
    if (menu.sub_menus) menu.sub_menus = menu.sub_menus.filter((subMenu) => !subMenu.deshabilitado);
    return menu;
  }

  async update(id: number, cambios: UpdateMenuDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    // Busca menu
    const menu = await this.menuORM.findOneBy({ id });
    if (!menu) throw new NotFoundException(`Menu con id ${id} no encontrado`);
    // Verifica si quieren cambiar el padre
    const idMenuPadre = cambios.menu_padre ? cambios.menu_padre : null;
    let menuPadreEncontrado: Menu | null = null;
    if (!idMenuPadre) menuPadreEncontrado = null;
    else {
      // Hay padre, lo busca
      menuPadreEncontrado = await this.menuORM.findOne({ where: { id: idMenuPadre, deshabilitado: false } });
      if (!menuPadreEncontrado) throw new NotFoundException(`Menu padre con id ${cambios.menu_padre} no encontrado`);
      if (menuPadreEncontrado.id === menu.id) throw new BadRequestException('Un menu no puede ser su propio padre');
    }
    // Aplica cambios
    const cambiosAplicados = {
      ...cambios,
      menu_padre: menuPadreEncontrado,
    };
    const nuevoMenu = this.menuORM.merge(menu, cambiosAplicados);
    return this.menuORM.save(nuevoMenu);
  }

  async borradoLogico(id: number) {
    const menu = await this.menuORM.findOneBy({ id });
    if (!menu) throw new NotFoundException(`Menu con id ${id} no encontrado`);
    else if (menu.deshabilitado) throw new BadRequestException(`El menu con id ${id} ya esta deshabilitado`);
    menu.deshabilitado = true;
    return this.menuORM.save(menu);
  }

  async eliminarRolDeMenu(idMenu: number, idRol: number) {
    const menu = await this.menuORM.findOne({ where: { id: idMenu, deshabilitado: false }, relations: ['roles'] });
    if (!menu) throw new NotFoundException(`Menu con id ${idMenu} no encontrado`);
    const rol = menu.roles.find((rol) => rol.id === idRol);
    if (!rol) throw new NotFoundException(`Rol con id ${idRol} no esta asignado al menu ${idMenu}`);
    menu.roles = menu.roles.filter((item) => item.id !== idRol);
    console.log(menu.roles);
    if (menu.roles.length === 0) throw new BadRequestException(`Un menu no puede quedarse sin roles`);
    return this.menuORM.save(menu);
  }

  async agregarRolDeMenu(idMenu: number, idRol: number) {
    const menu = await this.menuORM.findOne({ where: { id: idMenu, deshabilitado: false }, relations: ['roles'] });
    if (!menu) throw new NotFoundException(`Menu con id ${idMenu} no encontrado`);
    const rol = await this.rolORM.findOne({ where: { id: idRol, deshabilitado: false } });
    if (!rol) throw new NotFoundException(`Rol con id ${idRol} no encontrado`);
    if (menu.roles.find((item) => item.id === idRol)) throw new BadRequestException(`El menu con id ${idMenu} ya tiene al rol con id ${idRol}`);
    menu.roles.push(rol);
    return this.menuORM.save(menu);
  }

  /*
  async menusUsuario(id: number) {
    // Validar si el usuario existe
    const usuario = await this.usuarioORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!usuario) throw new NotFoundException(`El usuario con id ${id} no se encontro`);
    // Obtener sus roles y validar si tiene por lo menos uno
    const rolesDeUsuario = await this.usuarioRolService.devolverRoles(id);
    if (!rolesDeUsuario || rolesDeUsuario.length === 0) throw new NotFoundException(`El usuario con id ${id} no tiene roles asignados`);
    const resultado = [];
    let tieneMenus = false;
    // Iterar sobre los roles y obtener los menus de cada rol
    for (const rol of rolesDeUsuario) {
      const menusRol = await this.menuRolService.buscarMenuRol(rol.id_rol);
      if (menusRol && menusRol.length > 0) {
        // Iterar sobre los menus asociados a los roles
        tieneMenus = true;
        for (const menuRol of menusRol) {
          const menu = await this.menuORM.findOne({ where: { id: menuRol.id_menu, deshabilitado: false }, relations: ['menu_padre', 'sub_menus'] });
          // Solo agregar menus que no tengan menu_padre
          if (menu && !menu.menu_padre) {
            resultado.push(menu);
          }
        }
      }
    }
    // Si ningun rol del usuario tiene menus
    if (!tieneMenus) throw new NotFoundException(`Ningun rol del usuario con id ${id} tiene menus asignados`);
    return resultado;
  }
  */

  /*
  async remove(id: number) {
    const menu = await this.menuORM.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu con id ${id} no encontrado`);
    }
    this.menuORM.delete(id);
  }
  */
}
