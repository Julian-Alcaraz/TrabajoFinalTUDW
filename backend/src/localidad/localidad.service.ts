import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Localidad } from './entities/localidad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalidadService {
  constructor(@InjectRepository(Localidad) private readonly localidadORM: Repository<Localidad>) {}

  async create(createLocalidadDto: CreateLocalidadDto) {
    const localidad = await this.localidadORM.create(createLocalidadDto);
    return this.localidadORM.save(localidad);
  }

  findAll() {
    return this.localidadORM.find();
  }

  async findOne(id: number) {
    const localidad = await this.localidadORM.findOne({ where: { id, deshabilitado: false } });
    if (!localidad) throw new NotFoundException(`Localidad con id ${id} no encontrado`);
    return localidad;
  }

  async update(id: number, updateLocalidadDto: UpdateLocalidadDto) {
    if (Object.keys(updateLocalidadDto).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const localidad = await this.localidadORM.findOneBy({ id });
    if (!localidad) throw new NotFoundException(`Localidad con id ${id} no encontrado`);
    this.localidadORM.merge(localidad, updateLocalidadDto);
    return this.localidadORM.save(localidad);
  }

  async remove(id: number) {
    const localidad = await this.localidadORM.findOneBy({ id });
    if (!localidad) throw new NotFoundException(`Localidad con id ${id} no encontrado`);
    localidad.deshabilitado = true;
    return this.localidadORM.save(localidad);
  }
}
