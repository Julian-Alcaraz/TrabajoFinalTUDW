import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstitucionDto } from './dto/create-institucion.dto';
import { UpdateInstitucionDto } from './dto/update-institucion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Institucion } from './entities/institucion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstitucionService {
  constructor(@InjectRepository(Institucion) private readonly institucionORM: Repository<Institucion>) {}

  create(createInstitucionDto: CreateInstitucionDto) {
    const nuevaInstitucion = this.institucionORM.create({ ...createInstitucionDto });
    return this.institucionORM.save(nuevaInstitucion);
  }

  findAll() {
    return this.institucionORM.find({ where: { deshabilitado: false } });
  }

  async findOne(id: number) {
    const institucion = await this.institucionORM.findOne({ where: { id, deshabilitado: false } });
    if (!institucion) throw new NotFoundException(`Institucion con id ${id} no encontrada`);
    return institucion;
  }

  async update(id: number, updateInstitucionDto: UpdateInstitucionDto) {
    if (Object.keys(updateInstitucionDto).length === 0) throw new BadRequestException(`No se enviaron cambios`);
    const institucion = await this.institucionORM.findOneBy({ id });
    if (!institucion) throw new NotFoundException(`Institucion con id ${id} no encontrada`);
    this.institucionORM.merge(institucion, updateInstitucionDto);
    return this.institucionORM.save(institucion);
  }

  async remove(id: number) {
    const institucion = await this.institucionORM.findOneBy({ id });
    if (!institucion) throw new NotFoundException(`Institucion con id ${id} no encontrada`);
    else if (institucion.deshabilitado) throw new BadRequestException(`La institucion con id ${id} ya esta deshabilitada`);
    institucion.deshabilitado = true;
    return this.institucionORM.save(institucion);
  }
}
