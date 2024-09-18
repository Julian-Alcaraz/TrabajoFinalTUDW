import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { MenuRol } from './entities/menu-rol.entity';
import { CreateMenuRolDto } from './dto/create-menu-rol.dto';
import { UpdateMenuRolDto } from './dto/update-menu-rol.dto';
import { Menu } from 'src/menu/entities/menu.entity';
import { Rol } from 'src/rol/entities/rol.entity';

/*
  No esta hecho: borrado logico ni actualizar
*/
@Injectable()
export class MenuRolService {
  constructor(
    @InjectRepository(MenuRol) private menuRolRepo: Repository<MenuRol>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
    @InjectRepository(Menu) private menuRepo: Repository<Menu>,
  ) {}

  async create(createMenuRolDto: CreateMenuRolDto) {
    // Rol
    const idRol = createMenuRolDto.id_rol;
    const rol = await this.rolRepo.findOneBy({ id: idRol });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${idRol} no encontrado`);
    }
    // Menu
    const idMenu = createMenuRolDto.id_menu;
    const menu = await this.menuRepo.findOneBy({ id: idMenu });
    if (!menu) {
      throw new NotFoundException(`Menu con id ${idMenu} no encontrado`);
    }
    // Crea un nuevo menuRol
    const nuevoMenuRol = this.menuRolRepo.create({
      id_rol: rol.id,
      id_menu: menu.id,
    });
    // Guarda en BD
    return this.menuRolRepo.save(nuevoMenuRol);
  }

  findAll() {
    return this.menuRolRepo.find({ relations: ['menu', 'rol'] });
  }

  async findOne(idMenu: number, idRol: number) {
    const menuRol = await this.menuRolRepo.findOne({
      where: {
        id_menu: idMenu,
        id_rol: idRol,
      },
      relations: ['menu', 'rol'],
    });
    if (!menuRol) {
      throw new NotFoundException(`MenuRol con idMenu ${idMenu} e idRol ${idRol} no encontrado`);
    }
    return menuRol;
  }

  /*
  update(id: number, updateMenuRolDto: UpdateMenuRolDto) {
    return `This action updates a #${id} menuRol`;
  }
  */

  async remove(idMenu: number, idRol: number) {
    const menuRol = await this.menuRolRepo.findOne({
      where: {
        id_menu: idMenu,
        id_rol: idRol,
      },
      relations: ['menu', 'rol'],
    });
    if (!menuRol) {
      throw new NotFoundException(`MenuRol con idMenu ${idMenu} e idRol ${idRol} no encontrado`);
    }
    this.menuRolRepo.delete(menuRol);
  }

  /*
  async borradoLogico(idMenu: number, idRol: number) {
    const menuRol = await this.menuRolRepo.findOne({
      where: {
        id_menu: idMenu,
        id_rol: idRol,
      },
    });
    if (!menuRol) {
      throw new NotFoundException(`MenuRol con idMenu ${idMenu} e idRol ${idRol} no encontrado`);
    } else if (menuRol.deshabilitado) {
      throw new BadRequestException(`El menu con idMenu ${idMenu} e idRol ${idRol} ya esta deshabilitado`);
    }
    menuRol.deshabilitado = true;
    return this.menuRepo.save(menuRol);
  }
  */
}
