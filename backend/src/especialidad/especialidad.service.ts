import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { Especialidad } from './entities/especialidad.entity';

@Injectable()
export class EspecialidadService {
  constructor(@InjectRepository(Especialidad) private readonly especialidadORM: Repository<Especialidad>) {}

  create(createEspecialidadDto: CreateEspecialidadDto) {
    const nuevaEspecialidad = this.especialidadORM.create(createEspecialidadDto);
    return this.especialidadORM.save(nuevaEspecialidad);
  }

  findAll() {
    return this.especialidadORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const especialidad = await this.especialidadORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!especialidad) throw new NotFoundException(`Especialidad con id ${id} no encontrada`);
    return especialidad;
  }

  async update(id: number, cambios: UpdateEspecialidadDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const especialidad = await this.especialidadORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!especialidad) throw new NotFoundException(`Especialidad con id ${id} no encontrada`);
    this.especialidadORM.merge(especialidad, cambios);
    return this.especialidadORM.save(especialidad);
  }

  async remove(id: number) {
    const especialidad = await this.especialidadORM.findOneBy({ id });
    if (!especialidad) throw new NotFoundException(`Especialidad con id ${id} no encontrado`);
    else if (especialidad.deshabilitado) throw new BadRequestException(`La especialidad con id ${id} ya esta deshabilitado`);
    especialidad.deshabilitado = true;
    return this.especialidadORM.save(especialidad);
  }
}
