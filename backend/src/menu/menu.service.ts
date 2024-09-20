import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { UsuarioRolService } from 'src/usuario-rol/usuario-rol.service';
import { MenuRolService } from 'src/menu-rol/menu-rol.service';
//import { UsuarioService } from 'src/usuario/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuORM: Repository<Menu>,
    @InjectRepository(Menu) private readonly usuarioORM: Repository<Usuario>,
    private readonly usuarioRolService: UsuarioRolService,
    private readonly menuRolService: MenuRolService,
  ) {}

  async create(createMenuDto: CreateMenuDto) {
    const idMenuPadre = createMenuDto.menu_padre ? createMenuDto.menu_padre : null;
    let menu_padre: Menu | null = null;
    // Verifica si hay padre
    if (idMenuPadre !== null) {
      menu_padre = await this.menuORM.findOneBy({ id: idMenuPadre });
      if (!menu_padre) {
        throw new NotFoundException(`Menu con id ${idMenuPadre} no encontrado`);
      }
    }
    // Aplica cambios
    const nuevoMenu = this.menuORM.create({
      ...createMenuDto,
      menu_padre,
    });
    // Guarda en BD
    return this.menuORM.save(nuevoMenu);
  }

  async findAll() {
    const menus = await this.menuORM.find({ where: { deshabilitado: false }, relations: ['sub_menus'] });
    return menus;
  }

  async findOne(id: number) {
    const menu = await this.menuORM.findOne({ where: { id, deshabilitado: false }, relations: ['sub_menus'] });
    if (!menu) {
      throw new NotFoundException(`Menu con id ${id} no encontrado`);
    }
    // Si hay menu padre y esta deshabilitado no lo muestro
    if (menu.menu_padre && menu.menu_padre.deshabilitado) {
      menu.menu_padre = null;
    }
    return menu;
  }

  async update(id: number, cambios: UpdateMenuDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    // Busca menu a cambiar
    const menu = await this.menuORM.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu con id ${id} no encontrado`);
    }
    // Verifica si quieren cambiar el padre
    const idMenuPadre = cambios.menu_padre ? cambios.menu_padre : null;
    let menuPadreEncontrado: Menu | null = null;
    if (!idMenuPadre) {
      menuPadreEncontrado = null;
    } else {
      // Hay padre, lo busca
      menuPadreEncontrado = await this.menuORM.findOne({ where: { id: idMenuPadre, deshabilitado: false }, relations: ['sub_menus'] });
      if (!menuPadreEncontrado) {
        throw new NotFoundException(`Menu padre con id ${cambios.menu_padre} no encontrado`);
      }
      // Si el padre es igual al menu que se quiere cambiar da error
      if (menuPadreEncontrado.id === menu.id) {
        throw new BadRequestException('Un menu no puede ser su propio padre');
      }
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
    if (!menu) {
      throw new NotFoundException(`Menu con id ${id} no encontrado`);
    } else if (menu.deshabilitado) {
      throw new BadRequestException(`El menu con id ${id} ya esta deshabilitado`);
    }
    menu.deshabilitado = true;
    return this.menuORM.save(menu);
  }

  async getObjMenu(id: number) {
    const menu = await this.menuORM.find({ where: { id: id, menu_padre: null, deshabilitado: false }, relations: ['menu_padre', 'sub_menus'] });
    return menu;
  }

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

  /*
  async menusUsuario2(id: number) {
    // Cargar el usuario con sus roles y los menús asociados a esos roles
    const usuario = await this.usuarioORM.findOne({
      where: { id },
      relations: [
        'usuario_roles', // Relación entre usuario y roles
        'usuario_roles.rol', // Relación entre usuario_rol y rol
        'usuario_roles.rol.menu_rol', // Relación entre rol y menu_rol
        'usuario_roles.rol.menu_rol.menu', // Relación entre menu_rol y menu
        'usuario_roles.rol.menu_rol.menu.sub_menus', // Relación entre menu y sub_menus
        'usuario_roles.rol.menu_rol.menu.menu_padre', // Relación entre menu y menu_padre
      ],
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }
    const resultado = [];
    // Recorrer los roles del usuario y obtener los menús
    for (const usuarioRol of usuario.usuario_roles) {
      const rol = usuarioRol.rol;
      for (const menuRol of rol.menu_rol) {
        const menu = menuRol.menu;
        // Si el menú no tiene un `menuPadre`, es un menú principal
        if (!menu.menu_padre) {
          resultado.push(menu);
        }
      }
    }
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
