import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Barrio } from './entities/barrio.entity';
import { CreateBarrioDto } from './dto/create-barrio.dto';
import { UpdateBarrioDto } from './dto/update-barrio.dto';

@Injectable()
export class BarrioService {
  constructor(@InjectRepository(Barrio) private readonly barrioORM: Repository<Barrio>) {}

  create(createBarrioDto: CreateBarrioDto) {
    const barrio = this.barrioORM.create(createBarrioDto);
    return this.barrioORM.save(barrio);
  }

  findAll() {
    return this.barrioORM.find({ where: { deshabilitado: false } });
  }

  /*
  findAll() {
    return this.barrioORM.find({
      where: {
        deshabilitado: false,
        localidad: {
          id: 1,
        },
      },
      //relations: ['localidad'],
    });
  }
*/

  async findOne(id: number) {
    const barrio = await this.barrioORM.findOne({ where: { id, deshabilitado: false } /*relations: ['localidad'] */ });
    if (!barrio) throw new NotFoundException(`Barrio con id ${id} no encontrado`);
    return barrio;
  }

  async update(id: number, updateBarrioDto: UpdateBarrioDto) {
    if (Object.keys(updateBarrioDto).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const barrio = await this.barrioORM.findOneBy({ id });
    if (!barrio) throw new NotFoundException(`Barrio con id ${id} no encontrado`);
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
