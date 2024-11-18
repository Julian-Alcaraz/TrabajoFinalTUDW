import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Localidad } from './entities/localidad.entity';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { Barrio } from 'src/barrio/entities/barrio.entity';

@Injectable()
export class LocalidadService {
  constructor(
    @InjectRepository(Localidad) private readonly localidadORM: Repository<Localidad>,
    // @InjectRepository(Barrio) private readonly barrioORM: Repository<Barrio>,
  ) {}

  async create(createLocalidadDto: CreateLocalidadDto) {
    const localidad = await this.localidadORM.create(createLocalidadDto);
    return this.localidadORM.save(localidad);
  }

  findAll() {
    return this.localidadORM.find({ relations: ['barrios'] });
  }

  findAllHabilitadas() {
    return this.localidadORM.find({ where: { deshabilitado: false } });
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

  async findAllXLocalidad(id: number) {
    const localidad = await this.localidadORM.findOne({
      where: { id, deshabilitado: false },
      relations: ['barrios'],
    });
    if (!localidad) throw new NotFoundException(`Localidad con id ${id} no encontrada`);
    // Filtrar los barrios que no están deshabilitados
    const barriosActivos = localidad.barrios.filter((barrio) => !barrio.deshabilitado);
    return barriosActivos;
  }

  async remove(id: number) {
    const localidad = await this.localidadORM.findOneBy({ id });
    if (!localidad) throw new NotFoundException(`Localidad con id ${id} no encontrado`);
    localidad.deshabilitado = true;
    return this.localidadORM.save(localidad);
  }
}
