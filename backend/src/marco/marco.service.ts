import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMarcoDto } from './dto/create-marco.dto';
import { UpdateMarcoDto } from './dto/update-marco.dto';
import { Marco } from './entities/marco.entity';
import { Especialidad } from 'src/especialidad/entities/especialidad.entity';

@Injectable()
export class MarcoService {
  constructor(
    @InjectRepository(Marco) private readonly marcoORM: Repository<Marco>,
    @InjectRepository(Especialidad) private readonly especialidadORM: Repository<Especialidad>,
  ) {}

  async create(createMarcoDto: CreateMarcoDto) {
    const nuevoMarco = this.marcoORM.create({ ...createMarcoDto });
    const especialidad = await this.especialidadORM.findOneBy({ id: createMarcoDto.id_especialidad, deshabilitado: false });
    if (!especialidad) throw new NotFoundException(`El id de la especialidad ingresada no existe id: ${createMarcoDto.id_especialidad}`);
    nuevoMarco.especialidad = especialidad;
    return this.marcoORM.save(nuevoMarco);
  }

  findAll() {
    return this.marcoORM.find({ where: { deshabilitado: false }, relations: ['especialidad'] });
  }

  async findOne(id: number) {
    const marco = await this.marcoORM.findOne({ where: { deshabilitado: false, id: id } });
    if (!marco) throw new NotFoundException(`Marco con id ${id} no encontrado`);
    return marco;
  }

  async update(id: number, cambios: UpdateMarcoDto) {
    if (Object.keys(cambios).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const marco = await this.marcoORM.findOne({ where: { deshabilitado: false, id: id }, relations: ['especialidad'] });
    if (!marco) throw new NotFoundException(`Marco con id ${id} no encontrado`);

    // Especialidad
    const idEspecialidad = cambios.id_especialidad ? cambios.id_especialidad : null;
    let especialidadEncontrada: Especialidad | null = null;
    if (!idEspecialidad) especialidadEncontrada = null;
    else {
      especialidadEncontrada = await this.especialidadORM.findOne({ where: { id: idEspecialidad, deshabilitado: false } });
      if (!especialidadEncontrada) throw new NotFoundException(`Especialidad con id ${idEspecialidad} no encontrada`);
      if (especialidadEncontrada && marco.especialidad.id !== especialidadEncontrada.id) {
        marco.especialidad = especialidadEncontrada;
      } else {
        throw new BadRequestException(`Se envio la misma especialidad que ya tenia el marco`);
      }
    }

    this.marcoORM.merge(marco, cambios);
    return this.marcoORM.save(marco);
  }

  async remove(id: number) {
    const marco = await this.marcoORM.findOneBy({ id });
    if (!marco) throw new NotFoundException(`Marco con id ${id} no encontrado`);
    marco.deshabilitado = true;
    return this.marcoORM.save(marco);
  }
}
