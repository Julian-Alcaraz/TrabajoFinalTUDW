import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(@InjectRepository(Rol) private readonly rolORM: Repository<Rol>) {}

  create(createRolDto: CreateRolDto) {
    const nuevoRol = this.rolORM.create(createRolDto);
    return this.rolORM.save(nuevoRol);
  }

  findAll() {
    return this.rolORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const rol = await this.rolORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!rol) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    return rol;
  }

  async update(id: number, cambios: UpdateRolDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const rol = await this.rolORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!rol) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    this.rolORM.merge(rol, cambios);
    return this.rolORM.save(rol);
  }

  async borradoLogico(id: number) {
    const rol = await this.rolORM.findOneBy({ id });
    if (!rol) throw new NotFoundException(`Rol con id ${id} no encontrado`);
    else if (rol.deshabilitado) throw new BadRequestException(`El rol con id ${id} ya esta deshabilitado`);
    rol.deshabilitado = true;
    return this.rolORM.save(rol);
  }

  /*
  async remove(id: number) {
    const rol = await this.rolORM.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    return this.rolORM.delete(id);
  }
  */
}
