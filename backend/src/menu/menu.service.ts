import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { UsuarioRolService } from 'src/usuario-rol/usuario-rol.service';
import { MenuRolService } from 'src/menu-rol/menu-rol.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuORM: Repository<Menu>,
    private readonly usuarioRolService: UsuarioRolService,
    private readonly menuRolService: MenuRolService,
    private readonly usuarioService: UsuarioService,
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
    return this.menuORM.save(nuevoMenu);
  }

  async findAll() {
    const menus = await this.menuORM.find({ where: { deshabilitado: false }, relations: ['sub_menus'] });
    return menus;
    //return this.buildMenuTree(menus);
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

  async remove(id: number) {
    const menu = await this.menuORM.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu con id ${id} no encontrado`);
    }
    this.menuORM.delete(id);
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
    // findone de usuarioService:
    await this.usuarioService.findOne(id);
    // const usuario = await this.usuarioORM.findOne(id); throw new NotFoundException(`El usuario con id ${id} no existe`);
    const roles = await this.usuarioRolService.devolverRoles(id);
    // podria ser rolesService
    if (!roles) throw new NotFoundException(`El usuario con id ${id} no tiene roles`);
    const idsMenusDeUsuario = [];
    const resultado = [];
    for (const rol of roles) {
      const menus = await this.menuRolService.buscarMenuRol(rol.id_rol);
      if (menus.length === 0) throw new NotFoundException(`El rol con id ${rol.id_rol} no tiene menus`);
      for (const menu of menus) {
        idsMenusDeUsuario.push(menu.id_menu);
        const colMenus = await this.getObjMenu(menu.id_menu);
        for (const objMenu of colMenus) {
          if (!objMenu.menu_padre) {
            resultado.push(objMenu);
          }
        }
      }
    }
    return resultado;
  }
}
