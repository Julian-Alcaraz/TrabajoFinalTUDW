import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Barrio } from './entities/barrio.entity';
import { CreateBarrioDto } from './dto/create-barrio.dto';
import { UpdateBarrioDto } from './dto/update-barrio.dto';
import { Localidad } from 'src/localidad/entities/localidad.entity';

@Injectable()
export class BarrioService {
  constructor(
    @InjectRepository(Barrio) private readonly barrioORM: Repository<Barrio>,
    @InjectRepository(Localidad) private readonly localidadORM: Repository<Localidad>,
  ) {}

  async create(createBarrioDto: CreateBarrioDto) {
    const barrio = this.barrioORM.create(createBarrioDto);
    const localidad = await this.localidadORM.findOneBy({ id: createBarrioDto.id_localidad });
    if (!localidad) throw new NotFoundException(`Localidad con id ${createBarrioDto.id_localidad} no encontrada`);
    barrio.localidad = localidad;
    return this.barrioORM.save(barrio);
  }

  findAll() {
    return this.barrioORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const barrio = await this.barrioORM.findOne({ where: { id: id, deshabilitado: false } /*relations: ['localidad'] */ });
    if (!barrio) throw new NotFoundException(`Barrio con id ${id} no encontrado`);
    return barrio;
  }

  async update(id: number, updateBarrioDto: UpdateBarrioDto) {
    if (Object.keys(updateBarrioDto).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const barrio = await this.barrioORM.findOne({ where: { id: id, deshabilitado: false }, relations: ['localidad'] });
    if (!barrio) throw new NotFoundException(`Barrio con id ${id} no encontrado`);
    // Localidad
    const idLocalidad = updateBarrioDto.id_localidad ? updateBarrioDto.id_localidad : null;
    let localidadEncontrada: Localidad | null = null;
    if (!idLocalidad) localidadEncontrada = null;
    else {
      localidadEncontrada = await this.localidadORM.findOne({ where: { id: idLocalidad, deshabilitado: false } });
      if (!localidadEncontrada) throw new NotFoundException(`Localidad con id ${idLocalidad} no encontrada`);
      if (localidadEncontrada && barrio.localidad.id !== localidadEncontrada.id) {
        barrio.localidad = localidadEncontrada;
      } else {
        throw new BadRequestException(`Se envio la misma localidad que ya tenia el barrio`);
      }
    }
    this.barrioORM.merge(barrio, updateBarrioDto);
    return this.barrioORM.save(barrio);
  }

  async remove(id: number) {
    const barrio = await this.barrioORM.findOneBy({ id });
    if (!barrio) throw new NotFoundException(`Barrio con id ${id} no encontrado`);
    barrio.deshabilitado = true;
    return this.barrioORM.save(barrio);
  }
}
