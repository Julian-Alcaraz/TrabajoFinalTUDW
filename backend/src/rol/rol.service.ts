import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

/*
  Los metodos findOne, update y remove no verifican si el rol esta en deshabilitado = true
*/
@Injectable()
export class RolService {
  constructor(@InjectRepository(Rol) private rolRepo: Repository<Rol>) {}

  create(createRolDto: CreateRolDto) {
    const nuevoRol = this.rolRepo.create(createRolDto);
    return this.rolRepo.save(nuevoRol);
  }

  findAll() {
    return this.rolRepo.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const rol = await this.rolRepo.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    return rol;
  }

  async update(id: number, cambios: UpdateRolDto) {
    const rol = await this.rolRepo.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    this.rolRepo.merge(rol, cambios);
    return this.rolRepo.save(rol);
  }

  async remove(id: number) {
    const rol = await this.rolRepo.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    this.rolRepo.delete(id);
  }

  async borradoLogico(id: number) {
    const rol = await this.rolRepo.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    } else if (rol.deshabilitado) {
      throw new BadRequestException(`El rol con id ${id} ya está deshabilitado`);
    }
    rol.deshabilitado = true;
    this.rolRepo.save(rol);
  }
}
