import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(Menu) private menuRepo: Repository<Menu>) {}

  async create(createMenuDto: CreateMenuDto) {
    const idMenuPadre = createMenuDto.menu_padre ? createMenuDto.menu_padre : null;
    let menu_padre: Menu | null = null;
    // Verifica si hay padre
    if (idMenuPadre !== null) {
      menu_padre = await this.menuRepo.findOneBy({ id: idMenuPadre });
      if (!menu_padre) {
        throw new NotFoundException(`Menu con id ${idMenuPadre} no encontrado`);
      }
    }
    // Aplica cambios
    const nuevoMenu = this.menuRepo.create({
      ...createMenuDto,
      menu_padre,
    });
    return this.menuRepo.save(nuevoMenu);
  }

  findAll() {
    return this.menuRepo.find({ where: { deshabilitado: false }, relations: ['menu_padre'] });
  }

  async findOne(id: number) {
    const menu = await this.menuRepo.findOne({ where: { id }, relations: ['menu_padre'] });
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
    // Busca menu a cambiar
    const menu = await this.menuRepo.findOneBy({ id });
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
      menuPadreEncontrado = await this.menuRepo.findOne({ where: { id: idMenuPadre, deshabilitado: false } });
      if (!menuPadreEncontrado) {
        throw new NotFoundException(`Menu padre con id ${cambios.menu_padre} no encontrado`);
      }
      // Si el padre es igual al menu que se quiere cambiar da error
      if (idMenuPadre === menuPadreEncontrado.id) {
        throw new BadRequestException('Un menu no puede ser su propio padre');
      }
    }
    // Aplica cambios
    const cambiosAplicados = {
      ...cambios,
      menu_padre: menuPadreEncontrado,
    };
    const nuevoMenu = this.menuRepo.merge(menu, cambiosAplicados);
    return this.menuRepo.save(nuevoMenu);
  }

  async remove(id: number) {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu con id ${id} no encontrado`);
    }
    this.menuRepo.delete(id);
  }

  async borradoLogico(id: number) {
    const menu = await this.menuRepo.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`Menu con id ${id} no encontrado`);
    } else if (menu.deshabilitado) {
      throw new BadRequestException(`El menu con id ${id} ya esta deshabilitado`);
    }
    menu.deshabilitado = true;
    return this.menuRepo.save(menu);
  }
}
